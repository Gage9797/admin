<template>
  <div id="goods-index">
    <div class="top-bar">
      <div class="left">商品列表</div>
      <div class="right">
        <i-button type="success" @click="addGoods">添加商品</i-button>
      </div>
    </div>
    <div class="content">
      <i-table :columns="tableColumns" :data="tableData"></i-table>
      <i-page
        style="margin-top:10px;text-align: center;"
		:current.sync="currentPage"
        :total="pageTotal"
        show-elevator
        @on-change="changePage"
      ></i-page>
    </div>
    <!-- <i-modal v-model="addModel" title="添加商品" @on-ok="submitAddGoods" @on-cancel="addModel = false">
		<i-form ref="addForm" :model="addForm" :rules="addFormRules">
			<i-form-item label="商品名称" prop="name">
			<i-input type="text" v-model="addForm.name" placeholder="请填写商品名称" :maxlength="20"></i-input>
			</i-form-item>
			<i-form-item label="类目" prop="goodsClassifyId">
			<i-select v-model="addForm.goodsClassifyId">
				<i-option v-for="item in categories" :value="item.id" :key="item.id">{{item.name}}</i-option>
			</i-select>
			</i-form-item>
			<i-form-item label="价格" prop="price">
			<i-input-number :min="0" :max="655360" :precision="2" v-model="addForm.price" placeholder="价格"/>
			</i-form-item>
			<i-form-item label="库存" prop="inventory">
			<i-input-number :min="0" :max="655360" :precision="0" v-model="addForm.inventory" placeholder="库存"/>
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
				<i-radio-group v-model="addForm.state">
					<i-radio label="是">是</i-radio>
					<i-radio label="否">否</i-radio>
				</i-radio-group>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<Button type="text" @click="addModel = false">取消</Button>
			<Button type="primary" @click="submitAddGoods">确定</Button>
		</div>
    </i-modal> -->
    <!-- <i-modal
      v-model="editModel"
      title="编辑商品"
      @on-ok="submitEditGoods"
      @on-cancel="editModel = false">
      <i-form ref="editForm" :model="editForm" :rules="editFormRules">
        <i-form-item label="商品名称" prop="name">
          <i-input type="text" v-model="editForm.name" placeholder="请填写商品名称"></i-input>
        </i-form-item>
        <i-form-item label="类目" prop="goodsClassifyId">
          <i-select v-model="editForm.goodsClassifyId">
            <i-option v-for="item in categories" :value="item.id" :key="item.id">{{item.name}}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="价格" prop="price">
          <i-input-number2 :min="0" :max="655360" :precision="2" v-model="editForm.price" placeholder="价格"/>
        </i-form-item>
        <i-form-item label="库存" prop="inventory">
          <i-input-number :min="0" :max="655360" v-model="editForm.inventory" placeholder="库存"/>
        </i-form-item>
        <i-form-item label="图片">
          <QNupload ref="QNupload" @resourceUrl="getResourceUrl" showPreview :pic.sync="editForm.pic"/>
        </i-form-item>
        <i-form-item label="推荐" prop="isRecommend">
          <i-radio-group v-model="editForm.isRecommend">
            <i-radio label="是">是</i-radio>
            <i-radio label="否">否</i-radio>
          </i-radio-group>
        </i-form-item>
        <i-form-item label="是否零售">
			<i-radio-group v-model="editForm.state">
				<i-radio label="是">是</i-radio>
				<i-radio label="否">否</i-radio>
			</i-radio-group>
        </i-form-item>
      </i-form>
	  <div slot="footer">
   			<Button type="text" @click="editModel = false">取消</Button>
            <Button type="primary" @click="submitEditGoods">确定</Button>
	  </div>
    </i-modal> -->
  </div>
</template>
<script>
import objectTools from '@/tools/objectTools';
import QNupload from '../../components/upload/upload';
import InputNumber2 from '@/components/input-number';
import { formatPrice } from '@/tools';
import { downloadImgPrefix } from '@/config';

export default {
	name: 'goodsIndex',
	components: {
		InputNumber2,
		QNupload
	},
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),
			tableColumns: [
				{
					align: 'center',
					title: '图片',
					key: 'pic',
					render: (h, params) => {
						return h('img', {
							attrs: {
								style: 'width: 150px;height: 150px;',
								src: params.row.pic
							}
						});
					}
				},
				{ align: 'center', title: '商品名称', key: 'name' },
				{ align: 'center', title: '类目', key: 'goodsClassifyName' },
				{ align: 'center', title: '价格', key: 'price', render: (h, params) => h('div', formatPrice(params.row.price)) },
				{ align: 'center', title: '库存', key: 'inventory' },
				{ align: 'center', title: '推荐', key: 'isRecommend' },
				{ align: 'center', title: '是否零售', key: 'stateName' },
				{
					title: '商品二维码',
					key: 'download',
					align: 'center',
					render: (h, params) => {
						// if (this.canUse) {
						return h('div', [
							h('a', {
								attrs: {
									href: downloadImgPrefix + '/settings/qr/download?path=' + params.row.goodsqrurl,
									target: '_blank'
								}
							}, '点击下载')
						]);
						// } else {
						// 	return h('div', '仅在正式版中开通');
						// }
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h(
								'Button',
								{
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.editGoods(params.row);
										}
									}
								},
								'编辑'
							),
							h(
								'Button',
								{
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											this.del(params);
										}
									}
								},
								'删除'
							)
						]);
					}
				}
			],
			tableData: [],
			currentPage: 1,
			pageTotal: 0,
			addModel: false,
			editModel: false,
			addForm: {
				name: '',
				goodsClassifyId: '',
				price: 0,
				inventory: 0,
				pic: '',
				isRecommend: '是',
				state: '是'
			},
			editForm: {
				id: '',
				name: '',
				goodsClassifyId: '',
				price: 0,
				inventory: 0,
				pic: '',
				isRecommend: '',
				state: ''
			},
			addFormRules: {},
			editFormRules: {},
			categories: [],
			resourceUrl: '',
			paramsError: ''
		};
	},
	methods: {
		changePage () {
			this.getTableData();
		},
		getResourceUrl (data) {
			this.resourceUrl = data;
		},
		getTableData () {
			let me = this;
			let params = {
				teaHouseId: this.teaHouseId,
				currentPage: this.currentPage,
				pageSize: 10
			};
			this.$http
				.request(this, 'POST', '/goods/goodsListWithState', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						let list = res.result.list;
						list.forEach(ele => {
							ele.stateName = ele.state = ele.state ? '是' : '否';
						});
						me.tableData = list;
						// console.log(me.tableData);
						me.pageTotal = res.result.total;
					} else {
						me.$Message.error({
							content: '[' + res.errCode + ']' + res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		addGoods () {
			// let me = this;
			// me.addModel = true;
			// this.getCategories(function () {
			// 	me.addModel = true;
			// });
			this.$router.push({
				name: 'setting_addGoods'
			});
		},
		// getCategories (callback) {
		// 	let me = this;
		// 	this.$http
		// 		.request(this, 'GET', '/goods/goodsClassifyList', {})
		// 		.then(function (response) {
		// 			let res = response.data;
		// 			if (res.errCode === '000000') {
		// 				me.categories = res.result;
		// 				callback();
		// 			} else {
		// 				me.$Message.error({
		// 					content: '[' + res.errCode + ']' + res.errMsg
		// 				});
		// 			}
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error);
		// 		});
		// },
		// 参数校验
		// checkParams (params) {
		// 	// if (!params.state) {
		// 	// 	return true;
		// 	// }
		// 	if (params.name.trim() === '') {
		// 		this.paramsError = '未填写商品名称';
		// 		return false;
		// 	} else if (params.goodsClassifyId === '') {
		// 		this.paramsError = '未选择商品类目';
		// 		return false;
		// 	} else if (params.price === '') {
		// 		this.paramsError = '未填写商品价格';
		// 		return false;
		// 	} else if (isNaN(parseInt(params.price))) {
		// 		this.paramsError = '商品价格格式错误';
		// 		return false;
		// 	} else if (params.inventory === '') {
		// 		this.paramsError = '未填写商品库存';
		// 		return false;
		// 	} else if (isNaN(parseInt(params.inventory))) {
		// 		this.paramsError = '商品库存格式错误';
		// 		return false;
		// 	} else if (params.pic === '') {
		// 		this.paramsError = '未上传商品图片';
		// 		return false;
		// 	} else {
		// 		return true;
		// 	}
		// },
		// submitAddGoods () {
		// 	let me = this;
		// 	let params = objectTools.copy(this.addForm);
		// 	params.pic = this.resourceUrl;
		// 	params.teaHouseId = this.teaHouseId;
		// 	params.isRecommend = params.isRecommend === '是';
		// 	params.state = params.state === '是';	// 天坑，原来是中文
		// 	if (!this.checkParams(params)) {
		// 		this.$Message.error({
		// 			content: this.paramsError
		// 		});
		// 		return;
		// 	}
		// 	this.$http
		// 		.request(this, 'POST', '/goods/goodsAdd', params)
		// 		.then(function (response) {
		// 			let res = response.data;
		// 			if (res.errCode === '000000') {
		// 				me.addModel = false;
		// 				me.currentPage = 1;
		// 				me.getTableData();
		// 				// clear data
		// 				me.addForm = {
		// 					name: '',
		// 					goodsClassifyId: '',
		// 					price: 0,
		// 					inventory: 0,
		// 					pic: '',
		// 					isRecommend: '是',
		// 					state: '是'
		// 				};
		// 			} else {
		// 				me.$Message.error({
		// 					content: res.errMsg
		// 				});
		// 			}
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error);
		// 		});
		// },
		editGoods (params) {
			// let me = this;
			// me.getCategories(function () {
			// 	me.editForm = {
			// 		id: params.id,
			// 		name: params.name,
			// 		goodsClassifyId: params.goodsClassifyId,
			// 		price: params.price,
			// 		inventory: params.inventory,
			// 		pic: params.pic,
			// 		isRecommend: params.isRecommend,
			// 		state: params.state
			// 	};
			// 	me.editModel = true;
			// });
			this.$router.push({
				name: 'setting_addGoods',
				query: {
					id: params.id
				}
			});
		},
		submitEditGoods () {
			let me = this;
			let params = objectTools.copy(this.editForm);
			params.isRecommend = params.isRecommend === '是';
			params.state = params.state === '是';
			params.pic = this.resourceUrl === '' ? this.editForm.pic : this.resourceUrl;
			params.teaHouseId = this.teaHouseId;

			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$http
				.request(this, 'POST', '/goods/goodsUpdate', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						me.editModel = false;
						me.getTableData();
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

		del (params) {
			let me = this;
			this.$Modal.confirm({
				title: '删除确认',
				content: `<p>确定删除商品： ${params.row.name} 吗？</p>`,
				loading: true,
				onOk: function () {
					let httpParams = {
						id: params.row.id
					};
					me.$http
						.request(this, 'POST', '/goods/goodsDelete', httpParams)
						.then(function (response) {
							let res = response.data;
							if (res.errCode === '000000') {
								me.getTableData();
								me.$Modal.remove();
							} else {
								me.$Modal.remove();
								me.$Message.error({
									content: '[' + res.errCode + ']' + res.errMsg
								});
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				}
			});
		}
	},
	mounted () {
		this.getTableData();
	}
};
</script>
<style lang="less" scoped>
#goods-index {
  	background: #e4e4e2;
  	border-radius: 10px;
	padding: 10px;

	.top-bar {
		height: 45px;
		border-bottom: 1px solid #d8d8d6;
		line-height: 45px;
		.left {
		float: left;
		font-size: 20px;
		color: #7b7256;
		}
		.right {
		float: right;
		}
	}
	.content {
		margin-top: 15px;
	}
}
.modal-select {
	// 解决 fixed modal 中漂移的问题
	/deep/  .ivu-select-dropdown {
		position: fixed !important;
	}

}
</style>
