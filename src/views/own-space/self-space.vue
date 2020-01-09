<template>
    <div class="self-space">
        <div class="item-wrapper">
            <span class="title">员工姓名：</span>
            <span class="content">{{ userInfo.name }}</span>
        </div>
        <div class="item-wrapper">
            <span class="title">手机号码：</span>
            <span class="content">{{ userInfo.phone }}</span>
        </div>
         <div class="item-wrapper">
            <span class="title">员工工号：</span>
            <span class="content">{{ userInfo.jobNumber }}</span>
        </div>
        <div class="item-wrapper">
            <span class="title">所属部门：</span>
            <span class="content">{{ userInfo.departmentName }}</span>
        </div>
        <div class="item-wrapper">
            <span class="title">角色：</span>
            <span class="content">{{ userInfo.role }}</span>
        </div>
        <!-- <div class="item-wrapper">
            <span class="title">登录密码：</span>
            <Button class="content" @click="showModifyModal">修改密码</Button>
        </div>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass">
                    <i-input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" type="password" ></i-input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <i-input v-model="editPasswordForm.newPass" placeholder="请输入新密码，长度在6-16位之间"  type="password"></i-input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <i-input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"  type="password"></i-input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary"  :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal> -->
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
export default {
	data () {
		const valideRePassword = (rule, value, callback) => {
			if (value !== this.editPasswordForm.newPass) {
				callback(new Error('两次输入密码不一致'));
			} else {
				callback();
			}
		};
		return {
			userInfo: '',
			name: '',
			phone: '',
			jobNumber: '',
			departmentName: '',
			authorityName: '',
			account: '',
			editPasswordModal: false,
			editPasswordForm: {
				oldPass: '',
				newPass: '',
				rePass: ''
			},
			savePassLoading: false,
			passwordValidate: {
				oldPass: [
					{ required: true, message: '请输入原密码', trigger: 'blur' }
				],
				newPass: [
					{ required: true, message: '请输入新密码', trigger: 'blur' },
					{ min: 6, message: '请至少输入6个字符', trigger: 'blur' },
					{ max: 16, message: '最多输入16个字符', trigger: 'blur' }
				],
				rePass: [
					{ required: true, message: '请再次输入新密码', trigger: 'blur' },
					{ validator: valideRePassword, trigger: 'blur' }
				]
			}
		};
	},
	created () {
		this.userInfo = this.$store.state.userInfo;
		// this.$request.get('/staff/staffInfo')
		// 	.then(res => {
		// 		if (res.errCode === '000000') {
		// 			let result = res.result;
		// 			this.name = result.name;
		// 			this.phone = result.phone;
		// 			this.jobNumber = result.jobNumber;
		// 			this.departmentName = result.departmentName;
		// 			this.authorityName = result.authorityName;
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	},
	methods: {
		showModifyModal () {
			this.editPasswordModal = true;
			this.editPasswordForm = {};
		},
		cancelEditPass () {
			this.editPasswordModal = false;
		},
		saveEditPass () {
			this.$refs['editPasswordForm'].validate((valid) => {
				if (valid) {
					// this.savePassLoading = true;

					// you can write ajax request here
					// CryptoJS.MD5(me.form.password).toString(),
					let postBody = {
						userName: Cookies.get('user'),
						newPwd: CryptoJS.MD5(this.editPasswordForm.newPass).toString(),
						oldPwd: CryptoJS.MD5(this.editPasswordForm.oldPass).toString(),
						teaHouseId: this.teaHouseId
					};
					console.log('postBody', postBody);
					let that = this;
					this.$http.request(this, 'POST', '/staff/changePwd', postBody).then((res) => {
						if (res.data.errCode === '000000') {
							that.$Message.success('修改成功!');
							that.editPasswordModal = false;
						} else if (res.data.errCode == 'TEA00003019') {
							that.$Modal.warning({
								title: '修改失败',
								content: '原密码填写错误'
							});
						}
					}).catch((error) => {
						console.log(error);
					});
				}
			});
		}
	}
};
</script>

<style>
    .self-space{
        margin-top: 32px;
        margin-left: 16px;
    }
    .item-wrapper{
        font-size: 16px;
        margin-bottom: 8px;
    }
</style>

