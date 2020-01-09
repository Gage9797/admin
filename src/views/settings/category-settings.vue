<template>
<div id="categpry-index">
  <i-row :gutter="16">
    <i-col span="16">
      <div class="item-wrapper">
        <div class="top-bar">
          <div class="left">
            类目列表
          </div>
        </div>
        <div class="content">
          <i-table :columns="tableColumns" :data="tableData"></i-table>
        </div>
      </div>
    </i-col>
    <i-col span="8">
      <div class="item-wrapper">
        <div class="top-bar">
          <div class="left">
            添加商品类目
          </div>
        </div>
        <div class="content">
          <i-form ref="addForm" :model="addForm" :rules="addFormRules" @submit.native.prevent>
            <i-form-item label="类目名称" prop="name">
              <i-input type="text" v-model="addForm.name" placeholder="请填写类目名称" :maxlength="20"></i-input>
            </i-form-item>
          </i-form>
          <i-button type="success" style="width:100%" @click="addCategory">添加</i-button>
        </div>
      </div>
    </i-col>
  </i-row>
      <i-modal v-model="editModel" title="编辑类目" @on-ok="submitEdit">
      <i-form ref="editForm" :model="editForm" :rules="editFormRules" @submit.native.prevent>
        <i-form-item label="类目名称" prop="name">
          <i-input type="text" v-model="editForm.name" placeholder="请填写类目名称" :maxlength="20"></i-input>
        </i-form-item>
      </i-form>
      <div slot="footer">
		<i-button @click="editModel = false">取消</i-button>
        <i-button type="primary" @click="submitEdit">确定</i-button>
      </div>
    </i-modal>
</div>
</template>

<script>
export default {
	name: 'categoryIndex',
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),

			tableColumns: [
				{ title: '类目名称', key: 'name' },
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
											this.edit(params);
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
			addForm: {
				name: ''
			},
			addFormRules: {},
			editModel: false,
			editForm: {
				id: '',
				name: ''
			},
			editFormRules: {}
		};
	},
	methods: {
		getTableData () {
			let me = this;
			this.$http
				.request(this, 'GET', '/goods/goodsClassifyList')
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						me.tableData = res.result;
					} else {
						me.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {});
		},
		addCategory () {
			if (this.addForm.name.trim() === '') {
				this.$Message.error('类目名称不能为空！');
				return;
			}
			let me = this;
			let params = {
				name: this.addForm.name,
				teaHouseId: this.teaHouseId
			};
			this.$http
				.request(this, 'POST', '/goods/goodsClassifyAdd', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						me.addForm.name = '';
						me.getTableData();
					} else {
						me.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {});
		},
		edit (params) {
			this.editForm.id = params.row.id;
			this.editForm.name = params.row.name;
			this.editModel = true;
		},
		submitEdit () {
			if (this.editForm.name.trim() === '') {
				this.$Message.error('类目名称不能为空！');
				return;
			}

			let me = this;
			let params = {
				id: this.editForm.id,
				name: this.editForm.name,
				teaHouseId: this.teaHouseId
			};
			this.$http
				.request(this, 'POST', '/goods/goodsClassifyUpdate', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						me.getTableData();
						me.editModel = false;
					} else {
						me.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {});
		},
		del (params) {
			let me = this;
			this.$Modal.confirm({
				title: '删除确认',
				content: `<p>确定删除类目： ${params.row.name} 吗？</p>`,
				loading: true,
				onOk: function () {
					let httpParams = {
						id: params.row.id,
						teaHouseId: me.teaHouseId
					};
					me.$http
						.request(me, 'POST', '/goods/goodsClassifyDelete', httpParams)
						.then(function (response) {
							let res = response.data;
							if (res.errCode === '000000') {
								me.getTableData();
								me.$Modal.remove();
								me.$Message.success({
									content: '删除成功'
								});
							} else {
								me.$Message.error({
									content: res.errMsg
								});
								me.$Modal.remove();
							}
						})
						.catch(function (error) {});
				}
			});
		}
	},
	mounted () {
		this.getTableData();
	}
};
</script>

<style lang="less">
.item-wrapper {
  background: #e4e4e2;
  border-radius: 10px;
  padding: 15px;
  .top-bar {
    height: 45px;
    border-bottom: 1px solid #d8d8d6;
    line-height: 45px;
    .left {
      float: left;
      font-size: 20px;
      color: #7b7256;
    }
  }
  .content {
    margin-top: 15px;
  }
}
</style>
