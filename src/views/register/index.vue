<style lang="less" scoped>
@import "../main.less";

.protocol-wrapper {
	.protocol {
		width: 362px;
		height: 254px;
		font-size: 12px;
		line-height: 30px;
		letter-spacing: 1px;
		color: #565656;
		overflow: auto;
		p {
			text-indent: 24px;
		}
	}
	.btn-agree {
		display: block;
		width: 80%;
		margin: 34px auto 0;
	}
}



.register {
	width: 322px;
	.progress {
		text-align: center;
	}

	.user-info, .house-info {
		margin-top: 24px;
		background-color: #f4f3f2;

		.submit {
			width: 100%;
		}
	}

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

	.icon-wrapper {
		padding: 25px 0 16px;
		text-align: center;

		h1 {
			font-size: 20px;
			line-height: 23px;
			color: #cbaf64;
		}
	}

	.check-protocol-wrapper {
		font-size: 10px;
		line-height: 23px;
		letter-spacing: 1px;
		color: #999894;
		margin-bottom: 34px;

		.check-protocol-con {
			color: #35a2ee;
		}
	}

	.supplement {
		width: 303px;

		p {
			font-size: 12px;
			line-height: 20px;
			letter-spacing: 1px;
			color: #565656;
		}
		span {
			cursor: pointer;
			color: #1996de;
		}
	}

}

/deep/ .ivu-form-item-label {
	color: #c3a451;
	text-align-last: justify;
}
</style>

<template>
	<div class="big-bg">
		<ql-card :title="cardTitle" :size="titleSize">

			<!-- 具体注册模块 -->
			<section class="register">
				<div class="progress" v-if="step !== 3">
					<ql-progress class="first active">1.注册账号</ql-progress>
					<ql-progress :class="{'last': true, 'active': step === 2}">2.门店信息</ql-progress>
				</div>

				<div class="user-info" v-if="step === 1" @keypress.enter="handleNext">
					<Form ref="userInfoForm" :model="userInfoForm" :rules="userInfoFormRules" :label-width="100">
						<FormItem label="手机号码" prop="phone">
							<Input v-model="userInfoForm.phone" placeholder="请输入手机号"/>
						</FormItem>
						<FormItem label="短信验证码" prop="code">
							<Input v-model="userInfoForm.code" placeholder="请输入短信验证码"/>
							<span :class="{'code-btn': true, 'forbidden': codeForbidden}" @click="getCode">{{ codeBtnText }}</span>
						</FormItem>
						<FormItem label="设置密码" prop="password">
							<Input type="password" v-model="userInfoForm.password" placeholder="请输入6-16位密码"/>
						</FormItem>
						<FormItem label="确认密码" prop="password2">
							<Input type="password" v-model="userInfoForm.password2" placeholder="请确认密码"/>
						</FormItem>
					</Form>
					<Button type="primary" class="submit" @click="handleNext" :loading="nextLoading">下一步</Button>
				</div>

				<div class="house-info" v-else-if="step ===2" @keypress.enter="handleRegister">
					<Form ref="houseInfoForm" :model="houseInfoForm" :rules="houseInfoFormRules" :label-width="100">
						<FormItem label="茶馆名称" prop="name">
							<Input v-model="houseInfoForm.name" placeholder="请输入茶馆名"/>
						</FormItem>
						<FormItem label="地址选择" prop="address">
							<Cascader :data="addressData" v-model="houseInfoForm.address"></Cascader>
						</FormItem>
						<FormItem label="详细地址" prop="detailAddress">
							<Input v-model="houseInfoForm.detailAddress" placeholder="请输入详细地址"/>
						</FormItem>
					</Form>
					<div class="check-protocol-wrapper">
						<Checkbox v-model="hasReadProtocol">我已阅读并同意</Checkbox>
						<a href="#/serviceProtocol" target="_blank" class="check-protocol-con">《麒龍茶典智慧管家系统服务协议》</a>
					</div>
					<Button type="primary" class="submit" @click="handleRegister" :loading="registerLoading">立即注册</Button>
				</div>

				<div class="register-success" v-else>
					<div class="icon-wrapper">
						<Icon type="ios-checkmark-outline" color="#53ab25" size="45"></Icon>
						<h1>注册成功</h1>
					</div>
					<div class="supplement">
						<p>欢迎试用麒龍茶典智慧管家系统，我们将为您带来茶馆一站式新零售服务新体验！</p>
						<p>倒计时三秒，自动跳转登入界面，若未跳转，请点击<span @click="toLogin">立即登入>></span></p>
					</div>

				</div>
			</section>
		</ql-card>
	</div>
</template>

<script>
import QlCard from '@/components/ql-card';
import QlProgress from '@/components/ql-progress';
import AddressData from '@/assets/js/address.json';

export default {
	name: 'register',
	components: {
		QlCard,
		QlProgress
	},
	data () {
		// 密码格式校验器
		const validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('* 密码未填写'));
			} else if (!((value.length >= 6) && (value.length <= 16))) {
				callback(new Error('* 密码长度应在6-16位之间'));
			} else {
				if (this.userInfoForm.password2 !== '') {
					this.$refs.userInfoForm.validateField('password2');
				}
				callback();
			}
		};
		const validatePassCheck = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('* 请再次输入密码'));
			} else if (value !== this.userInfoForm.password) {
				callback(new Error('* 两次输入密码不一致！'));
			} else {
				callback();
			}
		};
		return {
			cardTitle: '免费试用',
			titleSize: 24,
			isReadingProtocol: false,
			step: 1,	// 当前的步骤，1,2, 3：注册成功了。

			// 个人信息表单
			userInfoForm: {
				phone: '',
				code: '',
				password: '',
				password2: ''
			},
			userInfoFormRules: {
				phone: [
					{ required: true, trigger: 'blur', message: '手机号码未填写' },
					{ pattern: /^1[35789]\d{9}$/, trigger: 'blur', message: '* 手机号码格式不正确！' }
				],
				code: [
					{ required: true, trigger: 'blur', message: '短信验证码未填写' }
				],
				password: [
					{ required: true, trigger: 'blur', message: '密码不可为空' },
					{ validator: validatePass }
				],
				password2: [
					{ required: true, trigger: 'blur', message: '密码不可为空' },
					{ validator: validatePassCheck }
				]
			},
			codeBtnText: '获取验证码',
			codeForbidden: false,
			nextLoading: false,

			// 茶馆信息表单
			houseInfoForm: {
				name: '',
				address: [],
				detailAddress: ''
			},
			houseInfoFormRules: {
				name: [
					{ required: true, trigger: 'blur', message: '茶馆名不可为空' }
				],
				address: [
					{ validator: (rule, value, callback) => {
						if (value.length === 0) {
							callback(new Error('省市区地址不可为空'));
						} else {
							callback();
						}
					} }
				],
				detailAddress: [
					{ required: true, trigger: 'blur', message: '详细地址不可为空' }
				]
			},
			hasReadProtocol: false,
			addressData: AddressData,
			registerLoading: false
		};
	},
	methods: {
		getCode () {
			if (this.codeForbidden) {
				return false;
			}
			this.$refs.userInfoForm.validateField('phone', (err) => {
				if (err) {
					this.$Message.error('请先输入有效的手机号码');
					return false;
				}

				// 获取验证码，60s内只能操作一次。
				let restTime = 60;
				this.codeForbidden = true;
				this.codeBtnText = '60 s';
				this.$request.post('/teaHouseManage/getVerifyCode', {phone: this.userInfoForm.phone, type: 1})
					.then(res => {
						if (res.errCode !== '000000') {
							this.$Message.error(res.errMsg);
							restTime = 0;
						}
					})
					.catch(err => {
						console.error(err);
						this.$Message.error('网络发生错误');
					});

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
		handleNext () {
			this.$refs.userInfoForm.validate((valid) => {
				if (!valid) {
					return false;
				}
				const params = {
					phone: this.userInfoForm.phone,
					code: this.userInfoForm.code,
					type: 1
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
		handleRegister () {
			if (!this.hasReadProtocol) {
				this.$Message.error('阅读并同意服务协议之后方可注册');
				return false;
			}
			this.$refs.houseInfoForm.validate(valid => {
				if (!valid) {
					return false;
				}

				const params = {
					phone: this.userInfoForm.phone,
					code: this.userInfoForm.code,
					password: this.userInfoForm.password,
					house_name: this.houseInfoForm.name,
					house_address: this.houseInfoForm.address.join('') + this.houseInfoForm.detailAddress
				};
				this.registerLoading = true;
				this.$request.post('/teaHouseManage/register', params)
					.then(res => {
						this.registerLoading = false;
						if (res.errCode === '000000') {
							this.step++; // 进入下一个环节
						} else {
							this.$Message.error(res.errMsg);
						}
					})
					.catch(err => {
						this.registerLoading = false;
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
	},
	watch: {
		step: function (v) {
			if (v === 3) {
				setTimeout(this.toLogin, 3000);
			}
		}
	}
};
</script>
