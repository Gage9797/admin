<style lang="less" scoped>
.top-header {
  height: 45px;
  margin-bottom: 15px;
  background: #e4e4e2;
  border-radius: 5px;
  .left {
    float: left;
    font-size: 20px;
    color: #7b7256;
    text-indent: 20px;
    line-height: 45px;
  }
  .right {
    float: right;
    line-height: 45px;
	padding-right: 20px;
	button {
		margin-right: 10px;
	}
  }
}
  /deep/ .ivu-input-number{
      width: 40% !important;
  }
  /deep/ .ivu-col-span-12{
      padding: 0 !important;
	  width: 30% !important;
	  text-overflow: ellipsis !important;
  }


</style>

<template>
    <div class="goods-add">
        <div class="top-header">
            <div class="left">商品设置</div>
            <div class="right">
				<Button type="success" @click="reback">&emsp;返回&emsp; </Button>
                <Button type="success" @click="submitHandle">&emsp;提交&emsp; </Button>
            </div>
        </div>
        <Tabs type="card">
            <TabPane label="基础信息" class="ql-tab-pane">
                <i-form ref="addForm" :model="addForm" :rules="addFormRules" :label-width="100">
                    <i-form-item label="商品名称" prop="name">
                        <i-input type="text" v-model="addForm.name" placeholder="请填写商品名称" :maxlength="20"></i-input>
                    </i-form-item>

                    <i-form-item label="类目" prop="goodsClassifyId">
                        <i-select v-model="addForm.goodsClassifyId">
                            <i-option v-for="item in categories" :value="item.id" :key="item.id">{{item.name}}</i-option>
                        </i-select>
                    </i-form-item>

                    <i-form-item label="价格" prop="price">
                        <InputNumber2 :min="0.01" :max="655360" :precision="2" v-model="addForm.price" placeholder="价格"/>
                    </i-form-item>

                    <i-form-item label="库存" prop="inventory">
                        <i-input-number :min="0" :max="655360" :precision="0" v-model="addForm.inventory" placeholder="库存" @keydown.native.capture="preventTapDefault"/>
                    </i-form-item>

                    <i-form-item label="图片">
                        <QNupload @resourceUrl="getResourceUrl" showPreview :pic.sync="addForm.pic"></QNupload>
                    </i-form-item>

                    <i-form-item label="推荐" prop="isRecommend">
                        <i-radio-group v-model="addForm.isRecommend">
                            <i-radio label="是">是</i-radio>
                            <i-radio label="否">否</i-radio>
                        </i-radio-group>
                    </i-form-item>

                    <i-form-item label="是否零售">
                        <RadioGroup v-model="addForm.state">
                            <i-radio label="是">是</i-radio>
                            <i-radio label="否">否</i-radio>
                        </RadioGroup>
                    </i-form-item>
                </i-form>
            </TabPane>
            <TabPane label="商品详情" class="ql-tab-pane">
                <text-editor
                    id="detail-editor"
					ref="editor"
                    :height="400"
                    v-model="addForm.description"
                />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import InputNumber2 from '@/components/input-number';
import QNupload from '../../components/upload/upload';
import textEditor from '../my-components/text-editor';
import objectTools from '@/tools/objectTools';

export default {
	components: {
		InputNumber2,
		QNupload,
		textEditor
	},
	data () {
		return {
			addForm: {
				name: '',
				goodsClassifyId: '',
				price: 0.01,
				inventory: 0,
				pic: '',
				isRecommend: '是',
				state: '是',
				description: ''
			},
			addFormRules: {},
			editFormRules: {},
			categories: [],
			resourceUrl: '',

			paramsError: ''
		};
	},
	created () {
		if (this.$route.query.id) {
			this.getGoodsInfo(this.$route.query.id);
		}
		this.getCategories();
	},
	methods: {
		// 取消 tap 按键的默认行为
		preventTapDefault (event) {
			if (event.keyCode === 9) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		getCategories () {
			let me = this;
			this.$http
				.request(this, 'GET', '/goods/goodsClassifyList', {})
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						me.categories = res.result;
					} else {
						me.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		// 参数校验
		checkParams (params) {
			// if (!params.state) {
			// 	return true;
			// }
			if (params.name.trim() === '') {
				this.paramsError = '未填写商品名称';
				return false;
			} else if (params.goodsClassifyId === '') {
				this.paramsError = '未选择商品类目';
				return false;
			} else if (params.price === '') {
				this.paramsError = '未填写商品价格';
				return false;
			} else if (isNaN(parseInt(params.price))) {
				this.paramsError = '商品价格格式错误';
				return false;
			} else if (params.inventory === '') {
				this.paramsError = '未填写商品库存';
				return false;
			} else if (isNaN(parseInt(params.inventory))) {
				this.paramsError = '商品库存格式错误';
				return false;
			} else if (params.pic === '') {
				this.paramsError = '未上传商品图片';
				return false;
			} else if (this.$refs.editor.isContentEmpty()) {
				this.paramsError = '未填写商品详情';
				return false;
			} else {
				return true;
			}
		},

		submitHandle () {
			if (this.$route.query.id) {
				this.submitEditGoods();
			} else {
				this.submit();
			}
		},

		submit () {
			let me = this;
			let params = objectTools.copy(this.addForm);
			params.pic = this.resourceUrl;
			params.teaHouseId = this.teaHouseId;
			params.isRecommend = params.isRecommend === '是';
			params.state = params.state === '是';	// 天坑，原来是中文
			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$http
				.request(this, 'POST', '/goods/goodsAdd', params)
				.then((response) => {
					let res = response.data;
					if (res.errCode === '000000') {
						this.$Message.success('添加成功');
						this.addForm = {
							name: '',
							goodsClassifyId: '',
							price: 0,
							inventory: 0,
							pic: '',
							isRecommend: '是',
							state: '是',
							description: ''
						};
						this.$router.replace({
							name: 'goods_index'
						});
					} else {
						me.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		getResourceUrl (data) {
			this.resourceUrl = data;
		},

		submitEditGoods () {
			let params = objectTools.copy(this.addForm);
			params.isRecommend = params.isRecommend === '是';
			params.state = params.state === '是';
			params.pic = this.resourceUrl === '' ? this.addForm.pic : this.resourceUrl;
			params.teaHouseId = this.teaHouseId;
			params.id = this.$route.query.id;
			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$http
				.request(this, 'POST', '/goods/goodsUpdate', params)
				.then((response) => {
					let res = response.data;
					if (res.errCode === '000000') {
						this.$router.replace({
							name: 'goods_index'
						});
						this.$Message.success('编辑成功');
					} else {
						this.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		reback () {
			this.$router.replace({
				name: 'goods_index'
			});
		},
		getGoodsInfo (id) {
			const params = {
				id
			};
			this.$http
				.request(this, 'POST', '/goods/goodsInfo', params)
				.then(response => {
					let res = response.data;
					if (res.errCode === '000000') {
						this.addForm = res.result;
						this.addForm.state = (this.addForm.state) ? '是' : '否';
						this.addForm.isRecommend = (this.addForm.isRecommend) ? '是' : '否';
					} else {
						this.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>
