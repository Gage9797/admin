<style lang="less" scoped>
.page {
    margin-top: 10px;
    text-align: center;
}
.count {
    margin-top: 40px;
    text-align: right;
}
.card-wrapper{
  background: rgb(228,228,226);
}
</style>

<template>
    <div id="goods-menu">
       <i-form  v-model="goodsMenuSearchForm" label-position="right" :label-width="90" inline>
            <i-form-item label="商品名称：">
               <i-input v-model="goodsMenuSearchForm.name"></i-input>
            </i-form-item>
            <i-form-item label="类别名称：">
                <i-select v-model="goodsMenuSearchForm.goodsClassifyId" style="width:100px">
                    <i-option v-for="t in typelist" :key="t.id" :value="t.id">{{ t.name }}</i-option>
                </i-select>
            </i-form-item>
            <i-button type="primary" style="margin-left: 8px;" @click="search">查询</i-button>
       </i-form>
       <i-row>
           <i-col span="11">
                <i-card class="card-wrapper">
                    <p slot="title">可选商品</p>
                    <i-table :columns="gslAltCol" :data="gslAlt" height="300"></i-table>
                    <div class="page">
                        <i-page :total="total" :current.sync="current" :page-size="goodsMenuSearchForm.pageSize" @on-change="pageNumChange"/>
                    </div>
                </i-card>
           </i-col>
           <i-col span="12" offset="1">
                <i-card class="card-wrapper">
                    <p slot="title">已选商品</p>
                    <i-table disabled-hover :columns="gslSelectedCol" :data="gslSelectedList" height="260"></i-table>
                    <div class="count">
                        <p>共 {{ gslSelectedCount }}  件</p>
                        <p>总计：￥ {{ gslSelectedSum }} 元</p>
                    </div>
                </i-card>
           </i-col>
       </i-row>
    </div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapGetters } from 'vuex';
import menuMixins from './menu';
const TEA_HOUSE_ID = Cookie.get('teaHouseId') || 1;

export default {
	name: 'goods-menu',
	mixins: [menuMixins],
	props: {
		isWithState: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			goodsMenuSearchForm: {
				teaHouseId: TEA_HOUSE_ID,
				currentPage: 1,
				pageSize: 10,
				name: '',
				goodsClassifyId: 0
			},
			total: 0,
			typelist: [],
			current: 1

			// gslAlt: []
		};
	},
	computed: {
		...mapGetters([
			'gslAlt',
			'gslSelectedList',
			'gslSelectedCount',
			'gslSelectedSum'
		])
	},
	methods: {
		init () {
			// 获取默认列表
			// this.getGslAlt();
			// 获取商品父列表
			// this.getGsPL();
		},
		getGsPL () {
			this.$http.request(this, 'GET', '/goods/goodsClassifyList')
				.then(res => {
					if (res.data.errCode === '000000') {
						this.typelist = res.data.result;
						this.typelist.unshift({
							id: 0,
							name: '全部'
						});
					} else {
						this.$Message.error(res.data.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getGslAlt (page = 1) {
			let qlp = this.goodsMenuSearchForm;
			qlp.currentPage = page;

			let postData = Object.assign({}, qlp);
			postData.goodsClassifyId = Number(qlp.goodsClassifyId) === 0 ? '' : qlp.goodsClassifyId;

			/**
			 * withState 将返回完整的商品列表。
			 * goodsList 只返回可以 零售 的内容。
			 */
			const requestUrl = this.isWithState ? '/goods/goodsListWithState' : '/goods/goodsList';

			this.$http.request(this, 'POST', requestUrl, postData)
				.then(res => {
					if (res.data.errCode === '000000') {
						let result = res.data.result;
						this.$store.commit('setGsl', {
							gsl: result.list
						});
						// this.gslAlt = result.list;
						this.total = result.total;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		pageNumChange (page) {
			this.getGslAlt(page);
		},
		search () {
			this.current = 1;	// 在查询的时候，reset一下页码
			this.getGslAlt();
		}
	},
	created () {
		this.init();
	}
};
</script>

