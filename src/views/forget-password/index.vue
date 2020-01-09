<style lang="less" scoped>
@import "../main.less";
.form-wrapper {
	min-width: 370px;
}
.code-form, .password-form {
	padding: 42px 0 50px;

	.code-btn {
		position: absolute;
		right: 6px;
		top: 0;
		display: block;
		width: 60px;
		text-align: center;
		color: #c2a558;
		cursor: pointer;

		&.forbidden {
			color: #657180;
			cursor: not-allowed;
		}
	}
}

.reset-success {
	text-align: center;
	.icon-wrapper {
		padding: 44px 0 18px;
	}

	h1 {
		font-size: 20px;
		line-height: 24px;
		color: #cbaf64;
	}

	.btn-back {
		width: 100%;
		margin-top: 50px;
	}
}

/deep/ .ivu-form-item-label {
	color: #c3a451;
	text-align-last: justify;
}
.btn-next {
	width: 100%;
}
</style>

<template>
	<div class="big-bg">
		<ql-card :title="cardTitle">
			<ql-progress class="first active">1.手机验证</ql-progress>
			<ql-progress :class="{'between': true, 'active': step > 1}">2.密码重置</ql-progress>
			<ql-progress :class="{'last': true, 'active': step === 3}">3.重置成功</ql-progress>

			<div class="form-wrapper">
				<!-- 填写手机验证码 -->
				<div class="code-form" v-if="step === 1" @keypress.enter="nextHandler">
					<Form ref="codeForm" :model="codeForm" :rules="codeFormRules" :label-width="100">
						<FormItem label="手机号码" prop="phone">
							<Input v-model="codeForm.phone" placeholder="请输入手机号"/>
						</FormItem>
						<FormItem label="短信验证码" prop="code">
							<Input v-model="codeForm.code" placeholder="请输入短信验证码"/>
							<span :class="{'code-btn': true, 'forbidden': codeForbidden}" @click="getCode">{{ codeBtnText }}</span>
						</FormItem>
					</Form>
					<Button class="btn-next" type="primary" :loading="nextLoading" @click="nextHandler">下一步</Button>
				</div>

				<!-- 重置密码 -->
				<div class="password-form" v-else-if="step === 2" @keypress.enter="resetHandler">
					<Form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" :label-width="100">
						<FormItem label="请输入新密码" prop="password">
							<Input type="password" v-model="passwordForm.password" placeholder=""/>
						</FormItem>
						<FormItem label="请确认新密码" prop="password2">
							<Input type="password" v-model="passwordForm.password2" placeholder=""/>
						</FormItem>
					</Form>
					<Button class="btn-next" type="primary" :loading="resetLoading" @click="resetHandler">重 置</Button>
				</div>

				<!-- 重置成功提示 -->
				<div class="reset-success" v-else>
					<div class="icon-wrapper">
						<Icon type="ios-checkmark-outline" color="#53ab25" size="45"></Icon>
					</div>
					<h1>重置成功</h1>
					<Button class="btn-back" type="primary" @click="toLogin">返回登录界面</Button>
				</div>
			</div>
		</ql-card>
	</div>
</template>

<script>
import QlCard from '@/components/ql-card';
import QlProgress from '@/components/ql-progress';

export default {
	name: 'forgetPassword',
	components: {
		QlCard,
		QlProgress
	},
	data () {
		// 密码格式校验器
		const validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('* 新密码未填写'));
			} else if (!(value.length >= 6 && value.length <= 16)) {
				callback(new Error('* 密码长度应在6-16位之间'));
			} else {
				if (this.passwordForm.password2 !== '') {
					this.$refs.passwordForm.validateField('password2');
				}
				callback();
			}
		};
		const validatePassCheck = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('* 请再次输入密码'));
			} else if (value !== this.passwordForm.password) {
				callback(new Error('* 两次输入密码不一致！'));
			} else {
				callback();
			}
		};
		return {
			step: 1,
			cardTitle: '忘记密码',

			// 验证码获取表单
			codeBtnText: '获取验证码',
			codeForbidden: false,
			nextLoading: false,
			codeForm: {
				phone: '',
				code: ''
			},
			codeFormRules: {
				phone: [
					{ required: true, trigger: 'blur', message: '手机号码不可为空' },
					{ pattern: /^1[35789]\d{9}/, trigger: 'blur', message: '* 手机号码格式不正确！' }
				],
				code: [
					{ required: true, trigger: 'blur', message: '验证码不可为空' }
				]
			},

			// 重置密码表单
			resetLoading: false,
			passwordForm: {
				password: '',
				password2: ''
			},
			passwordFormRules: {
				password: [{ validator: validatePass }],
				password2: [{ validator: validatePassCheck }]
			}
		};
	},
	methods: {
		getCode () {
			this.$refs.codeForm.validateField('phone', err => {
				if (err) {
					this.$Message.error('请先输入有效的手机号码');
					return false;
				}

				if (this.codeForbidden) {
					return false;
				}

				// 获取验证码，60s内只能操作一次。
				this.codeForbidden = true;
				this.codeBtnText = '60 s';
				this.$request.post('/teaHouseManage/getVerifyCode', {phone: this.codeForm.phone, type: 2}); // 这里暂时不做提示。

				let restTime = 60;
				let forbiddenTime = () => {
					setTimeout(() => {
						if (--restTime > 0) {
							this.codeBtnText = restTime + ' s';
							forbiddenTime();
						} else {
							this.codeBtnText = '获取验证码';
							this.codeForbidden = false;
						}
					}, 1000);
				};

				forbiddenTime();
			});
		},
		nextHandler () {
			this.$refs.codeForm.validate(valid => {
				if (!valid) {
					return false;
				}
				const params = {
					phone: this.codeForm.phone,
					code: this.codeForm.code,
					type: 2
				};
				this.nextLoading = true;
				this.$request.post('/teaHouseManage/checkVerifyCode', params)
					.then(res => {
						this.nextLoading = false;
						if (res.errCode === '000000') {
							this.step++; // 进入下一个环节
						} else {
							this.$Message.error(res.errMsg);
						}
					})
					.catch(err => {
						this.nextLoading = false;
						this.$Message.error(err.message);
						console.log(err);
					});
			});
		},
		resetHandler () {
			this.$refs.passwordForm.validate(valid => {
				if (!valid) {
					return false;
				}

				const params = {
					phone: this.codeForm.phone,
					code: this.codeForm.code,
					password: this.passwordForm.password
				};
				this.resetLoading = true;
				this.$request.post('/teaHouseManage/resetPassword', params)
					.then(res => {
						this.resetLoading = false;
						if (res.errCode === '000000') {
							this.step++; // 进入下一个环节
						} else {
							this.$Message.error(res.errMsg);
						}
					})
					.catch(err => {
						this.resetLoading = false;
						this.$Message.error(err.message);
						console.log(err);
					});
			});
		},
		toLogin () {
			this.$router.push({
				name: 'login'
			});
		}
	}
};
</script>
