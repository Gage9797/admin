<template>
    <div class="priority-page">
        <Table border :columns="columns3" :data="data3"></Table>
        <Page style="margin-top:20px;text-align: center;" :current.sync="current" :total="priorityTotal" show-elevator @on-change="changePriorityPage"></Page>

		<div  class="add-button"><Button type="primary" @click="showModal">新增权限</Button></div>
        <Modal
			v-model="modalFlag"
			title="新增权限"
		>
            <Form :rules="ruleValidate" ref="formValidate" :model="formValidate">
                <FormItem class="add-item" label="权限名称" prop="name">
                    <i-input v-model="formValidate.name" style="width: 300px" :maxlength="30"></i-input>
                </FormItem>
                <FormItem class="add-item" prop="description" label="权限描述">
                    <i-input v-model="formValidate.description" style="width: 300px" type="textarea" :row="4" :maxlength="50"></i-input>
                </FormItem>
                <FormItem class="add-item" prop="authority" label="权限设定" >
                    <div>.</div>
                    <Tree :data="data4"  ref="tree" show-checkbox></Tree>
                </FormItem>
            </Form>
			<div slot="footer">
				<Button @click="modalFlag=false" type="text" size="large">取消</Button>
				<Button @click="setAuthorityId(handleSubmit)" type="primary" size="large" :loading="loading">确定</Button>
			</div>
        </Modal>
        <Modal title="修改权限" v-model="modalFlag2" @on-cancel="modalFlag2=false"  @on-ok="modifyAuth" >
            <Form ref="itemFormValidate" :model="itemFormValidate" :rules="ruleValidate">
                <FormItem class="add-item" label="权限名称" prop="name">
                    <i-input v-model="itemFormValidate.name" style="width: 300px" :maxlength="30"></i-input>
                </FormItem>
                <FormItem class="add-item" prop="description" label="权限描述">
                    <i-input v-model="itemFormValidate.description" style="width: 300px" type="textarea" :row="4" :maxlength="50"></i-input>
                </FormItem>
                <FormItem class="add-item" prop="authority" label="权限设定" >
                    <div>.</div>
                    <Tree :data="data5" ref="itemTree" show-checkbox></Tree>
                </FormItem>
            </Form>
			<div slot="footer">
                <Button @click="modalFlag2 = false" type="text" size="large">取消</Button>
                <Button @click="modifyAuth" type="primary" size="large" :loading="loading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
	inject: ['refreshMySon'],
	created () {
		// this.getInitalTable();
		// this.getAuthoritySetting(function () {});
	},
	data () {
		return {
			loading: false,
			columns3: [
				{
					title: '权限',
					key: 'name',
					align: 'center'
				},
				{
					title: '描述',
					key: 'description',
					align: 'center'
				},
				{
					title: '操作',
					key: 'operation',
					align: 'center',
					render: (h, params) => {
						let that = this;

						let operationButton = [];

						if (!params.row.isAdmin) {
							operationButton = [
								h('Button', {
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '15px'
									},
									on: {
										click: () => {
											that.getModifyModal(params);
										}
									}
								}, '修改'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											that.deleteAuthority(params.row.id);
										}
									}
								}, '删除')

							];
						}

						return h('div', operationButton);
					}
				}
			],
			data3: [],
			modalFlag: false,
			formValidate: {
				name: '',
				description: '',
				authority: []
			},
			ruleValidate: {
				name: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('权限名称不得为空'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				description: [{
					required: true,
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('权限描述不得为空'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
				authority: { required: true, message: '权限列表不可为空' } // 这里仅为了统一样式。实际校验在后续逻辑
			},
			data4: [],
			modalFlag2: false,
			authoritySetting: [],
			itemFormValidate: {
				id: 0,
				name: '',
				description: '',
				authority: []
			},
			data5: [],
			teaHouseId: this.$util.getTeaHouseId(),
			priorityTotal: 0,
			current: 1
		};
	},
	methods: {
		refresh () {
			this.getInitalTable();
			this.getAuthoritySetting(function () {});
		},
		showModal () {
			this.getAuthoritySetting(function () {});
			this.formValidate = {
				name: '',
				description: '',
				authority: []
			};
			this.modalFlag = true;
		},
		setAuthorityId (callback) {
			let checkNodesId = [];
			let checkNodes = this.$refs.tree.getCheckedNodes();
			for (let i = 0; i < checkNodes.length; i++) {
				if (!('children' in checkNodes[i])) {
					// 将非父级节点加入（比如：营业 的 桌台管理）
					checkNodesId.push(checkNodes[i].id);
				} else if (checkNodes[i].children.length === 0) {
					// 没有儿子节点的，应该要将自身加入。
					checkNodesId.push(checkNodes[i].id);
				}
			}
			callback(checkNodesId);
		},
		handleSubmit (checkNodesId) {
			this.formValidate.authority = checkNodesId;
			this.$refs['formValidate'].validate((valid) => {
				if (valid) {
					if (checkNodesId.length === 0) {
						this.loading = false;
						this.$Message.error('权限设定不可为空');
						return false;
					}
					let postBody = {
						teaHouseId: this.teaHouseId,
						name: this.formValidate.name,
						description: this.formValidate.description,
						authList: checkNodesId
					};
					this.loading = true;
					this.$http.request(this, 'POST', '/staff/addAuth', postBody).then((res) => {
						this.loading = false;
						if (res.data.errCode === '000000') {
							this.$Message.success('添加成功!');
							this.modalFlag = false;
							this.getInitalTable();
							this.refreshMySon();
						} else {
							this.$Message.error(res.data.errMsg);
						}
					}).catch();
				} else {
					this.loading = false;
				}
			});
		},
		getInitalTable (page = 1) {
			if (page === 1) {
				// reset
				this.current = 1;
			}

			let that = this;
			let postBody = {
				teaHouseId: this.teaHouseId,
				currentPage: page
			};
			this.$http.request(this, 'POST', '/staff/authList', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					that.data3 = [];
					let resArr = res.data.result.authList;
					for (let i = 0; i < resArr.length; i++) {
						that.data3[i] = resArr[i];
					}
				}
				that.priorityTotal = res.data.result.total;
			}).catch();
		},
		changePriorityPage (page) {
			this.getInitalTable(page);
		},
		getAuthoritySetting (callback) {
			let that = this;
			that.authoritySetting = [];
			this.$http.request(this, 'GET', '/staff/getAuthSetting').then((res) => {
				if (res.data.errCode === '000000') {
					let resArr = res.data.result.authList;
					that.data4 = new Array(resArr.length);
					for (let i = 0; i < resArr.length; i++) {
						that.data4[i] = {};
						that.data4[i].title = resArr[i].level;
						that.data4[i].id = resArr[i].authId;
						that.data4[i].children = [];
						let len = resArr[i].auth.length;
						if (len === 0) {
							that.authoritySetting.push({
								authId: resArr[i].authId,
								authName: resArr[i].level
							});
						}
						for (let j = 0; j < resArr[i].auth.length; j++) {
							that.data4[i].children[j] = {};
							that.data4[i].children[j].title = resArr[i].auth[j].authName;
							that.data4[i].children[j].id = resArr[i].auth[j].authId;
							let item = {};
							item.authId = resArr[i].auth[j].authId;
							item.authName = resArr[i].auth[j].authName;
							that.authoritySetting.push(item);
						}
					}
					that.data5 = that.data4;
					callback();
				}
			}).catch((err) => {
				console.log(err);
			});
		},
		deleteAuthority (id) {
			this.$Modal.confirm({
				title: '删除确认',
				content: '确定删除该权限吗？',
				onOk: () => {
					let that = this;
					let postBody = {
						'id': id
					};
					this.$http.request(this, 'POST', '/staff/delAuth', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							that.getInitalTable();
							that.refreshMySon();
							that.$Message.success('删除成功');
						} else if (res.data.errCode === 'TEA00003018') {
							that.$Message.error('存在员工持有该权限，无法删除');
						} else {
							that.$Message.error('删除失败');
						}
					}).catch((err) => {
						console.log(err);
						that.$Message.error('删除失败');
					});
				}
			});
		},
		modifyAuth () {
			let checkNodes = this.$refs['itemTree'].getCheckedNodes();
			let checkNodesId = [];
			for (let i = 0; i < checkNodes.length; i++) {
				if (!('children' in checkNodes[i])) {
					checkNodesId.push(checkNodes[i].id);
				} else if (checkNodes[i].checked === true && checkNodes[i].children.length === 0) {
					checkNodesId.push(checkNodes[i].id);
				}
			}
			this.itemFormValidate.authority = checkNodesId;

			this.$refs['itemFormValidate'].validate((valid) => {
				if (!valid) {
					return false;
				}

				if (checkNodesId.length === 0) {
					this.$Message.error('权限设定不可为空');
					return false;
				}

				let that = this;
				let postBody = {
					id: this.itemFormValidate.id,
					name: this.itemFormValidate.name,
					description: this.itemFormValidate.description,
					authList: checkNodesId
				};
				this.loading = true;
				this.$http.request(this, 'POST', '/staff/modifyAuth', postBody).then((res) => {
					this.loading = false;
					this.modalFlag2 = false;
					if (res.data.errCode === '000000') {
						that.getInitalTable();
						that.refreshMySon();
						that.$Message.success('修改成功！');
					} else {
						that.$Message.success('修改失败！');
					}
				}).catch((err) => {
					console.log(err);
					this.loading = false;
					this.modalFlag2 = false;
					that.$Message.success('修改失败！');
				});
			});
		},
		getModifyModal (params) {
			this.itemFormValidate.name = params.row.name || '';
			this.itemFormValidate.description = params.row.description || '';
			this.itemFormValidate.id = params.row.id;
			let arr = params.row.authList;// 二级数组
			this.itemFormValidate.authority = arr;// 二级数组
			let that = this;
			// 拿到修改权限的对话框的权限设置列表以后，判断选中的权限并打勾
			this.getAuthoritySetting(function () {
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < that.data5.length; j++) {
						if (arr[i].id === that.data5[j].id) {
							if (arr[i].children.length === 0) { that.$set(that.data5[j], 'checked', true); } else {
								for (let k = 0; k < arr[i].children.length; k++) {
									for (let l = 0; l < that.data5[j].children.length; l++) {
										if (arr[i].children[k].id === that.data5[j].children[l].id) {
											that.$set(that.data5[j].children[l], 'checked', true);
										}
									}
								}
							}
						}
					}
				}
				that.modalFlag2 = true;
			});
		}
	}
};
</script>
<style lang="less" scoped>
    .add-button{
        margin-bottom: 20px;
    }
    .add-item{
        text-align: center;
        margin-bottom: 10px;
    }
    .add-title{
        font-weight: bold
    }
    /deep/ .ivu-input{
      background: rgb(235,235,233)
    }
    /deep/ .ivu-select-selection{
      background: rgb(235,235,233)
    }
</style>


