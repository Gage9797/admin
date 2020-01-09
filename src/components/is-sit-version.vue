<style lang="less" scoped>
.is-sit {
	header {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 300px;

		div {
			// display: flex;
			height: 280px;
			// line-height: 280px;
			background: url("../images/only-logo.png") center center no-repeat;
			justify-content: center;
			font-size: 24px;
			padding-top: 120px;
			text-align: center;

			h1 {
				display: inline-block;
				font-size: 20px;
			}
			a {
				display: inline-block;
				font-size: 17px;
				margin-left: 40px;
			}
		}
		p {
			font-size: 14px;
			margin-top: 20px;
			text-align: center;
		}
  	}

}
</style>

<template>
  <div class="is-sit">
    <header>
		<div v-if="canRedirect">
			<h1>该功能在正式版中开通</h1>
			<router-link :to="routerOption">{{ title }}<i>>></i></router-link>
			<p>客服热线：400-810-9944</p>
		</div>
		<div v-else>
			审核阶段该功能未开通。
			<p>客服热线：400-810-9944</p>
		</div>

    </header>
  </div>
</template>

<script>
export default {
	name: 'isSitVersion',
	data () {
		return {
			title: ''
		};
	},
	computed: {
		canRedirect () {
			return this.$store.state.user.appVersion !== 2;
		},
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
