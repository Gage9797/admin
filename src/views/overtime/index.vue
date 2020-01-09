<style lang="less" scoped>

</style>

<template>
	<is-sit-version/>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';
export default {
	name: 'overtime',
	components: {
		IsSitVersion
	},
	data () {
		return {
			title: ''
		};
	},
	computed: {
		routerOption () {
			if (this.$store.state.user.appVersion === 3) {
				this.title = '在线续费';
				return {
					name: 'locatePayment'
				};
			} else {
				this.title = '升级为正式版';
				return {
					name: 'locateHouseInfo'
				};
			}
		}
	}
};
</script>
