<style lang="less" scoped>
    .add-button{
        // margin-bottom: 20px;
    }
    .add-item{
        // margin-bottom: 10px;
    }
    .add-title{
        font-weight: bold
    }
    /deep/ .ivu-input{
      background: #EBEBE9
    }
    /deep/ .ivu-select-selection{
      	background: #EBEBE9
	}
	/deep/ .ivu-input-number-input {
		background: #EBEBE9
	}
</style>

<template>
    <div class="department-page">
        <Table border :columns="columns2" :data="data2"></Table>
        <Page style="margin-top:20px;text-align: center;" :current.sync="current" :total="departTotal" show-elevator @on-change="changeDepartPage"></Page>
        <div class="add-button"><Button type="primary" @click="showModal">新增部门</Button></div>

		<!-- add -->
        <Modal v-model="modalFlag" title="新增部门" class="modal-wrapper">
			<Form :rules="ruleValidate" ref="formValidate" :model="formValidate" :label-width="80">
				<FormItem class="add-item" label="部门名称" prop="name">
					<i-input v-model="formValidate.name" :maxlength="20"></i-input>
				</FormItem>
				<FormItem class="add-item" label="部门描述" prop="description">
					<i-input v-model="formValidate.description" type="textarea" :rows="4" :maxlength="50"></i-input>
				</FormItem>
				<FormItem class="add-item" label="开台绩效" prop="tableMerit">
					<Row>
						<Col span="8" offset="2">
							员工 <InputNumber :min="0" :max="100" v-model="formValidate.tableMerit[0]"/> %
						</Col>
						<Col span="8" offset="2">
							部门 <InputNumber :min="0" :max="100" v-model="formValidate.tableMerit[1]"/> %
						</Col>
					</Row>
				</FormItem>
				<FormItem class="add-item" label="商品绩效" prop="goodsMerit">
					<Row>
						<Col span="8" offset="2">
							员工 <InputNumber :min="0" :max="100" v-model="formValidate.goodsMerit[0]"/> %
						</Col>
						<Col span="8" offset="2">
							部门 <InputNumber :min="0" :max="100"  v-model="formValidate.goodsMerit[1]"/> %
						</Col>
					</Row>
				</FormItem>
			</Form>

            <div slot="footer">
              <Button @click="modalFlag=false" type="text" size="large">取消</Button>
              <Button @click="handleSubmit"  type="primary" size="large" :loading="loading">确定</Button>
            </div>
        </Modal>

		<!-- update -->
         <Modal title="修改部门信息" v-model="modalFlag2">
			<Form ref="itemForm" :model="itemForm" :rules="itemRuleValidate" :label-width="80">
                <FormItem class="add-item" label="部门名称" prop="name">
                    <i-input v-model="itemForm.name" :maxlength="20"></i-input>
                </FormItem>
                <FormItem class="add-item" label="部门描述" prop="description" >
                    <i-input v-model="itemForm.description" type="textarea" :rows="4" :maxlength="50"></i-input>
                </FormItem>
				<FormItem class="add-item" label="开台绩效" prop="tableMerit">
					<Row>
						<Col span="8" offset="2">
							员工 <InputNumber :min="0" :max="100" v-model="itemForm.tableMerit[0]"/> %
						</Col>
						<Col span="8" offset="2">
							部门 <InputNumber :min="0" :max="100" v-model="itemForm.tableMerit[1]"/> %
						</Col>
					</Row>
				</FormItem>
				<FormItem class="add-item" label="商品绩效" prop="goodsMerit">
					<Row>
						<Col span="8" offset="2">
							员工 <InputNumber :min="0" :max="100" v-model="itemForm.goodsMerit[0]"/> %
						</Col>
						<Col span="8" offset="2">
							部门 <InputNumber :min="0" :max="100"  v-model="itemForm.goodsMerit[1]"/> %
						</Col>
					</Row>
				</FormItem>
            </Form>
			<div slot="footer">
              <Button @click="modalFlag2 = false" type="text" size="large">取消</Button>
              <Button @click="itemHandleSubmit"  type="primary" size="large" :loading="loading">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
	inject: ['refreshMySon'],
	data () {
		const emptyValidatorGen = (msg) => (rule, value, callback) => {
			if (value.trim() !== '') {
				callback();
			} else {
				callback(new Error(msg));
			}
		};
		return {
			columns2: [
				{
					title: '部门',
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
						return h('div', [
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
										this.modalFlag2 = true;
										this.itemForm.name = params.row.name;
										this.itemForm.description = params.row.description;
										this.itemForm.id = params.row.id;
										this.itemForm.tableMerit = params.row.tableMerit;
										this.itemForm.goodsMerit = params.row.goodsMerit;
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
										this.deleteDepartment(params.row.id);
									}
								}
							}, '删除')

						]);
					}
				}
			],
			data2: [],
			modalFlag: false,
			formValidate: {
				name: '',
				description: '',
				tableMerit: [0, 0],
				goodsMerit: [0, 0]
			},
			ruleValidate: {
				name: [{
					required: true,
					validator: emptyValidatorGen('部门名称不能为空'),
					trigger: 'blur'
				}],
				description: [{
					required: true,
					validator: emptyValidatorGen('部门描述不能为空'),
					trigger: 'blur'
				}],
				tableMerit: [],
				goodsMerit: []
			},
			modalFlag2: false,
			itemForm: {
				name: '',
				description: '',
				id: 0,
				tableMerit: [0, 0],
				goodsMerit: [0, 0]
			},
			itemRuleValidate: {
				name: [{
					required: true,
					validator: emptyValidatorGen('部门名称不能为空'),
					trigger: 'blur'
				}],
				description: [{
					required: true,
					validator: emptyValidatorGen('部门描述不能为空'),
					trigger: 'blur'
				}]
			},
			teaHouseId: this.$util.getTeaHouseId(),
			departTotal: 0,
			loading: false,
			current: 1
		};
	},
	created () {
		this.getInitialTable();
	},
	methods: {
		refresh () {
			this.getInitialTable();
		},
		getInitialTable (page = 1) {
			if (page === 1) {
				// reset
				this.current = 1;
			}
			let params = {
				teaHouseId: this.teaHouseId,
				currentPage: page
			};
			const p1 = this.$request.post('/staff/deptList', params);
			const p2 = this.$request.get('/staff/deptMeritList');

			Promise.all([p1, p2])
				.then(([r1, r2]) => {
					if (r1.errCode === '000000' && r2.errCode === '000000') {
						const depList = r1.result.deptList;
						const deptMeritList = r2.result.deptList;
						this.departTotal = r1.result.total;

						this.data2 = depList.map(item => {
							let meritItem = deptMeritList.find(i => i.id === item.id);
							if (meritItem) {
								if (meritItem.tableMerit) {
									item.tableMerit = [meritItem.tableMerit.person || 0, meritItem.tableMerit.dept || 0];
								} else {
									item.tableMerit = [0, 0];
								}

								if (meritItem.goodsMerit) {
									item.goodsMerit = [meritItem.goodsMerit.person || 0, meritItem.goodsMerit.dept || 0];
								} else {
									item.goodsMerit = [0, 0];
								}
							}
							return item;
						});
					} else {
						throw new Error('网络出错');
					}
				})
				.catch(err => {
					this.$Message.error(err.message);
				});
		},
		showModal () {
			this.modalFlag = true;
			this.formValidate = {
				name: '',
				description: '',
				tableMerit: [0, 0],
				goodsMerit: [0, 0]
			};
		},
		handleSubmit () {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					let postBody = {
						teaHouseId: this.teaHouseId,
						name: this.formValidate.name,
						description: this.formValidate.description,
						tableMerit: {
							person: this.formValidate.tableMerit[0],
							dept: this.formValidate.tableMerit[1]
						},
						goodsMerit: {
							person: this.formValidate.goodsMerit[0],
							dept: this.formValidate.goodsMerit[1]
						}
					};
					this.loading = true;
					this.$http.request(this, 'POST', '/staff/addDept', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							this.modalFlag = false;
							this.getInitialTable();
							this.refreshMySon();
							this.$Message.success('添加成功');
						} else {
							this.$Message.error(res.data.errMsg);
						}
						this.loading = false;
					}).catch((err) => {
						console.log(err);
						this.loading = false;
						this.modalFlag = false;
						this.$Message.error('添加失败!');
					});
				} else {
					return false;
				}
			});
		},
		changeDepartPage (page) {
			this.getInitialTable(page);
		},
		deleteDepartment (id) {
			this.$Modal.confirm({
				title: '删除确认',
				content: '确定删除该部门吗？',
				onOk: () => {
					let postBody = {
						'id': id
					};
					let that = this;
					this.$http.request(this, 'POST', '/staff/delDept', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							that.getInitialTable();
							that.refreshMySon();
							that.$Message.success('删除成功');
						} else if (res.data.errCode === 'TEA00003017') {
							that.$Message.error('该部门下存在员工，无法删除!');
						}
					}).catch((err) => {
						console.log(err);
						that.$$Message.error('删除失败');
					});
				}
			});
		},
		itemHandleSubmit () {
			this.$refs.itemForm.validate((valid) => {
				if (valid) {
					let postBody = {
						id: this.itemForm.id,
						name: this.itemForm.name,
						description: this.itemForm.description,
						tableMerit: {
							person: this.itemForm.tableMerit[0],
							dept: this.itemForm.tableMerit[1]
						},
						goodsMerit: {
							person: this.itemForm.goodsMerit[0],
							dept: this.itemForm.goodsMerit[1]
						}
					};
					this.$http.request(this, 'POST', '/staff/modifyDept', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							this.getInitialTable();
							this.refreshMySon();
							this.modalFlag2 = false;
							this.$Message.success('修改成功');
						}
					}).catch((error) => {
						console.log(error);
						this.$Message.error('修改失败');
					});
				} else {
					return false;
				}
			});
		}
	}
};
</script>


