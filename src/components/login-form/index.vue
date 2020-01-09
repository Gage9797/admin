<style lang="less" scoped>
@import "./style.less";

</style>

<template>
	<div class="ql-form">
		<div class="ql-form-item">
			<div class="ql-form-item-prepend">
				<img src="./icon/person.png" alt="person icon">
			</div>
			<div class="ql-form-item-content">
				<input type="text" v-model="form.userName" @blur="onBlur('userName')" placeholder="请输入账号">
			<p class="err-msg" v-show="invalid.userName">账号不可为空</p>
			</div>
		</div>
		<div class="ql-form-item">
			<div class="ql-form-item-prepend">
				<img src="./icon/lock.png" alt="lock icon">
			</div>
			<div class="ql-form-item-content">
				<input type="password" v-model="form.password" @blur="onBlur('password')"  placeholder="请输入密码">
				<p class="err-msg" v-show="invalid.password">密码不可为空</p>
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'LoginForm',
	props: {
		form: {
			default: () => {
				return {
					userName: '',
					password: ''
				};
			}
		}
	},
	data () {
		return {
			invalid: {
				userName: false,
				password: false
			}
		};
	},
	computed: {

	},
	methods: {
		onBlur (propname) {
			this.invalid[propname] = this.form[propname].length === 0;
			// if (this.form[propname].length === 0) {
			//     this.invalid[propname] = true;
			// } else {
			//     this.invalid[propname] = false
			// }
			return this.invalid[propname];
		},
		validate (cb) {
			cb(this.isValid());
		},
		isValid () {
			const invalidObj = this.invalid;
			let flag = true;
			Object.entries(invalidObj).forEach(([k, v]) => {
				if (this.onBlur(k)) {
					flag = false;
				}
			});
			return flag;
		}
	}
};
</script>
