<template>
    <div class="worker-page">
        <Table :columns="columns1" :data="data1"></Table>
        <Page style="margin-top:20px;text-align: center;" :current.sync="current"  :total="staffTotal" show-elevator @on-change="changeStaffPage"></Page>
        <div class="add-button"><Button type="primary" @click="showModal">新增员工</Button></div>
        <div class="madal-wrapper">
            <Modal
				v-model="modalFlag"
				title="新增员工">
                <Form  ref="formValidate" :model="formValidate">
                    <FormItem class="add-item" prop="name" label="员工姓名">
                        <i-input v-model="formValidate.name" style="width: 300px;text-algin:center;" :maxlength="20"></i-input>
                    </FormItem>
					<FormItem class="add-item" prop="password" label="账号密码">
                        <i-input v-model="formValidate.password" style="width: 300px;text-algin:center;"  :maxlength="20"></i-input>
                    </FormItem>
                    <FormItem class="add-item" prop="phone" label="手机号码">
                        <i-input v-model="formValidate.phone" style="width: 300px;text-algin:center;"></i-input>
                    </FormItem>
                    <FormItem class="add-item" prop="department" label="所属部门">
                        <Select v-model="formValidate.department" style="width:300px;text-algin:center;">
                            <Option v-for="item in departmentList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="add-item" prop="role" label="所属权限">
                        <Select v-model="formValidate.role" style="width:300px;text-algin:center;">
                            <Option v-for="item in roleList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div slot="footer">
                  <Button @click="modalFlag=false" type="text" size="large">取消</Button>
                  <Button @click="addUserInfo()" type="primary" size="large" :loading="loading">确定</Button>
                </div>
            </Modal>
            <Modal v-model="modifyModalFlag" title="修改员工信息" @on-ok="modify()">
                <Form :model="modifyInfo" ref="modifyInfo">
                    <!-- <FormItem label="账号"  class="add-item" prop="account">
                        <i-input style="width: 300px"  v-model="modifyInfo.account"></i-input>
                    </FormItem> -->
                     <FormItem label="姓名"  class="add-item" prop="name">
                        <i-input style="width: 300px;text-algin:center;" v-model="modifyInfo.name" :maxlength="20"></i-input>
                    </FormItem>
                     <FormItem label="手机" class="add-item" prop="phone">
                        <i-input style="width: 300px;text-algin:center;"  v-model="modifyInfo.phone"></i-input>
                    </FormItem>
                     <!-- <FormItem label="工号" class="add-item" prop="jobNumber">
                        <i-input style="width: 300px"  v-model="modifyInfo.jobNumber"  :maxlength="20"></i-input>
                    </FormItem> -->
                     <FormItem label="部门" class="add-item" prop="department">
                        <Select :value="modifyInfo.department" style="width:300px" @on-change="changeDepartment">
                            <Option v-for="item in departmentList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                     <FormItem label="角色" class="add-item" prop="role">
                         <Select :value="modifyInfo.role" style="width:300px" @on-change="changerole">
                            <Option v-for="item in roleList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                </Form>
				<div slot="footer">
                  	<Button @click="modifyModalFlag = false" type="text" size="large">取消</Button>
                  	<Button @click="modify()" type="primary" size="large">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
const validatePhone = (rule, value, callback) => {
	if (!value) {
		callback(new Error('手机号不能为空'));
	} else if (!/^1\d{10}$/.test(value)) {
		callback(new Error('手机号格式不正确'));
	} else {
		callback();
	}
};

export default {
	created () {
		// this.getInitialTable();
		// this.getInitialPriority();
		// this.getInitialDepart();
		this.getInitialStaff();
	},
	data () {
		const emptyValidatorGen = (msg) => (rule, value, callback) => {
			if (value && value.trim() !== '') {
				callback();
			} else {
				callback(new Error(msg));
			}
		};
		return {
			columns1: [
				// {
				//     title: '员工账号',
				//     key: 'account',
				//     align: 'center',
				//     minWidth: 100
				// },
				{
					title: '姓名',
					key: 'name',
					align: 'center',
					minWidth: 100
				},
				{
					title: '手机号码',
					key: 'phone',
					align: 'center',
					minWidth: 100
				},
				{
					title: '工号',
					key: 'jobNumber',
					align: 'center',
					minWidth: 100
				},
				{
					title: '部门',
					key: 'department',
					align: 'center',
					minWidth: 100
				},
				{
					title: '角色',
					key: 'role',
					align: 'center',
					minWidth: 100

				},
				{
					title: '操作',
					key: 'operation',
					align: 'center',
					width: 140,
					render: (h, params) => {
						let that = this;
						const operateButton = [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disable: true
								},
								style: {
									marginRight: '10px'
								},
								on: {
									click: () => {
										let temp = that.data1[params.index];
										that.modifyInfo.account = temp.account;
										that.modifyInfo.name = temp.name;
										that.modifyInfo.phone = temp.phone;
										that.modifyInfo.jobNumber = temp.jobNumber;
										that.modifyInfo.department = temp.department;
										that.modifyInfo.role = temp.role;
										that.modifyInfo.id = temp.id;
										that.modifyModalFlag = true;
									}
								}
							}, '修改')
						];

						if (!params.row.isRoot) {
							operateButton.push(
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											// if (params.row.isRoot) {
											// 	this.$Message.error('超级管理员账号不可删除。');
											// 	return false;
											// }
											that.deleteStaff(params.row.id);
										}
									}
								}, '删除')
							);
						}

						return h('div', operateButton);
					}
				}
			],
			data1: [],
			userInfo: '',
			modalFlag: false,
			formValidate: {
				account: '',
				name: '',
				phone: '',
				jobNumber: '',
				department: '',
				role: '',
				password: ''
			},
			ruleValidate: {
				// account: [{
				//     required: true,
				//     message: '员工号为必填字段',
				//     trigger: 'blur'
				// }],
				name: [{
					required: true,
					validator: emptyValidatorGen('员工名为必填字段'),
					trigger: 'blur'
				}],
				phone: [{
					required: true,
					validator: validatePhone,
					trigger: 'blur'
				}],
				jobNumber: [{
					required: true,
					validator: emptyValidatorGen('工号为必填字段'),
					trigger: 'blur'
				}],
				department: [{
					required: true,
					message: '员工所属部门为必填字段',
					trigger: 'blur'
				}],
				role: [{
					required: true,
					message: '员工权限为必填字段',
					trigger: 'blur'
				}]
			},
			departmentList: [
				'运营部',
				'技术部',
				'财务部',
				'销售部',
				'客服部',
				'行政部'
			],
			roleList: ['超级管理员', '普通员工'],
			objectData: {},
			modifyModalFlag: false,
			modifyInfo: {
				id: 0,
				account: '',
				name: '',
				phone: '',
				jobNumber: '',
				department: '',
				role: ''
			},
			ruleValidate2: {
				// account: [{
				//     required: true,
				//     message: '员工号为必填字段',
				//     trigger: 'blur'
				// }],
				name: [{
					required: true,
					validator: emptyValidatorGen('员工名为必填字段'),
					trigger: 'blur'
				}],
				phone: [{
					required: true,
					validator: validatePhone,
					trigger: 'blur'
				}],
				jobNumber: [{
					required: true,
					validator: emptyValidatorGen('工号为必填字段'),
					trigger: 'blur'
				}],
				department: [{
					required: true,
					message: '员工所属部门为必填字段',
					trigger: 'blur'
				}],
				role: [{
					required: true,
					message: '员工权限为必填字段',
					trigger: 'blur'
				}]
			},
			teaHouseId: this.$util.getTeaHouseId(),
			staffTotal: 0,
			loading: false,
			current: 1
		};
	},
	methods: {
		refresh () {
			this.getInitialPriority();
			// this.getInitialDepart();
			this.getInitialStaff();
		},
		showModal () {
			this.formValidate = {};
			this.modalFlag = true;
		},
		addUserInfo () {
			this.$http
				.request(this, 'POST', '/staff/addStaff', this.formValidate)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('添加成功!');
						this.getInitialStaff();
						this.modalFlag = false;
					} else {
						this.$Message.error(
							'失败'
						);
					}
				});
		},
		handleSubmit () {
			let that = this;
			this.$refs['formValidate'].validate((valid) => {
				if (valid) {
					let postBody = {
						'account': that.objectData.account,
						'name': that.objectData.name,
						'telephone': that.objectData.phone,
						'jobNumber': that.objectData.jobNumber,
						'teaHouseId': this.teaHouseId,
						'departmentId': this.objectData.departmentId,
						'roleId': this.objectData.roleId
					};
					this.loading = true;
					this.$http.request(this, 'POST', '/staff/addStaff', postBody).then((res) => {
						that.loading = false;
						if (res.data.errCode === '000000') {
							that.$Message.success('添加成功!');
							// that.getInitialTable();
							that.getInitialStaff();
							that.modalFlag = false;
						} else {
							that.$Message.error(res.data.errMsg);
						}
					}).catch((error) => {
						that.loading = false;
						that.modalFlag = false;
						that.$Message.success('添加失败!');
						console.log(error);
					});
				} else {
					return false;
					// that.$Message.error('添加失败!');
				}
			});
		},
		getInitialStaff (page = 1) {
			if (page === 1) {
				// reset
				this.current = 1;
			}

			let that = this;
			let postBody = {
				teaHouseId: this.teaHouseId,
				currentPage: page
			};
			this.userInfo = this.$store.userInfo;
			this.$http.request(this, 'POST', '/staff/staffList', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					that.data1 = res.data.data.staffList;
					// that.staffTotal = res.data.result.total;
				}
			}).catch();
		},
		changeStaffPage (page) {
			this.getInitialStaff(page);
		},
		deleteStaff (id) {
			this.$Modal.confirm({
				title: '删除确认',
				content: '确定删除该员工吗？',
				onOk: () => {
					let that = this;
					let postBody = {
						'id': id
					};
					this.$http.request(this, 'POST', '/staff/deleteStaff', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							that.$Message.success('删除成功!');
							// that.getInitialTable();
							that.getInitialStaff();
						} else {
							that.$Message.success('删除失败!');
						}
					}).catch((error) => {
						that.$Message.success('删除失败!');
					});
				}
			});
		},
		modify () {
			this.$http
				.request(this, 'POST', '/staff/modifyStaff', this.modifyInfo)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('修改成功!');
						this.getInitialStaff();
						this.modifyModalFlag = false;
					} else {
						this.$Message.error(
							'失败'
						);
					}
				});
		},
		changeDepartment (option) {
			this.modifyInfo.department = option;
		},
		changerole (option) {
			this.modifyInfo.role = option;
		}
	}
};
</script>
<style scoped lang="less">
    .add-item{
        text-align: center;
        margin-bottom: 10px;
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
    /deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
      color: #D0CFCA;
      text-align: left;
    }
</style>

