<style lang="less" scoped>
.audit {
	padding: 12px 0 90px;
	text-align: center;
	background: url('../../images/only-logo.png') center top/210px no-repeat;

	h1 {
		font-size: 20px;
		margin: 25px 0;
		color: #bf9013;
	}
	.btn {
		width: 290px;
		margin-top: 80px;
	}

	.supplement {
		width: 440px;
		margin: 0 auto;
		text-align: left;
		text-indent: 48px;
	}
}
</style>

<template>
	<div class="audit">
		<div class="pay-success">
			<div class="icon-wrapper">
				<Icon type="ios-checkmark-outline" color="#53ab25" size="52"></Icon>
			</div>
			<h1>恭喜您支付成功</h1>
			<div class="supplement">
				<p>我们会尽快对您所提交的资质进行审核，预计在5~7个工作日内完成，审核通过后我们将以短信的方式通知您。请耐心等候。</p>
			</div>
		</div>
		<Button type="primary" class="btn" @click="toLogin">返回登入界面</Button>
	</div>
</template>

<script>
export default {
	name: 'locateAudit',
	methods: {
		toLogin () {
			this.$store.commit('logout');
			this.$router.push({
				name: 'login'
			});
		}
	}
};
</script>
