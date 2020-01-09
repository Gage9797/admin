<style lang="less">
@import "./main.less";
@import "./login.less";
</style>

<template>
    <div class="big-bg login" @keydown.enter="handleSubmit">
		<div class="login-con">
			<header class="login-con-header">
				<img src="../images/login-logo.png" alt="">
			</header>
			<div class="form-con">
				<login-form :form="form" ref="loginForm">
					<i-button style="width: 100%;" @click="handleSubmit" :loading="isLoading">登 录</i-button>
				</login-form>
			</div>
			<footer class="login-tip">
				<div class="login-tip-version">
					版本号：V1.1
				</div>
				<!-- <div class="login-tip-content">
					<router-link to="/register">
						<a>申请试用 | </a>
					</router-link>
					<router-link to="/forgetPassword">
						<a>忘记密码？</a>
					</router-link>
				</div> -->
			</footer>
		</div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import LoginForm from '@/components/login-form';

export default {
	data () {
		return {
			isLoading: false,
			form: {
				userName: '',
				password: ''
			},
			rules: {
				userName: [
					{ required: true, message: '账号不能为空', trigger: 'blur' }
				],
				password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
			}
		};
	},
	components: {
		LoginForm
	},
	methods: {
		handleSubmit () {
			let me = this;
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					let params = {
						userName: me.form.userName,
						password: me.form.password
					};
					me.isLoading = true;
					me.$request
						.post('/login', params)
						.then(function (response) {
							me.isLoading = false;
							console.log(response.errCode);
							if (response.errCode === '000000') {
								// Cookies.set('token', response.data.token);
								// Cookies.set('phone', params.userName);
								// console.log('userInfo', response.data.userInfo);
								params.role = response.data.userInfo.role;
								console.log('params', params);
								me.$store.commit('setUserInfo', response.data.userInfo);
								me.$store.dispatch('GetUserInfo', params)
									.then(() => {
										me.$store.dispatch('UpdateMenulist', params)
											.then(defaultPage => {
												console.log('defaultPage', defaultPage);
												me.$router.push('/business/seat-room');
											});
									});
							} else {
								me.$Message.error({
									content: '账号或密码错误！'
								});
							}
						})
						.catch(function (error) {
							console.log('error', error);
							me.isLoading = false;
							me.$Message.error({
								content: '网络请求失败'
							});
						});
				}
			});
		}
	}
};
</script>
