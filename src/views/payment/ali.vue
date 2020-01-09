<style lang="less" scoped>

</style>

<template>
	<div v-html="formStr">aa</div>
</template>

<script>
export default {
	name: 'paymentAli',
	data () {
		return {
			formStr: ''
		};
	},
	created () {
		this.formStr = window.localStorage.getItem('ALI_PAY_FORM');
		setTimeout(() => {
			document.forms[0].submit();
		}, 0);
	}
};
</script>
