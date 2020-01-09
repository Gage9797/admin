<style lang="less" scoped>
.locate {
	width: 920px;
	margin: 20px auto;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.6);

	&-header {
		padding: 20px 0 0;
		text-align: center;
	}

	&-body {
		padding: 40px;
	}
}
/deep/ .ivu-form-item-label {
	color: #c3a451;
	text-align-last: justify;
}
</style>

<template>
	<div id="locate" class="locate">
		<header class="locate-header">
			<ql-progress class="first active">1.门店信息</ql-progress>
			<ql-progress :class="{'between': true, 'active': step > 1}">2.提交资质</ql-progress>
			<ql-progress :class="{'between': true, 'active': step > 2}">3.在线支付</ql-progress>
			<ql-progress :class="{'last': true, 'active':  step > 3}">4.审核阶段</ql-progress>
		</header>

		<main class="locate-body">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</main>
	</div>
</template>

<script>
import QlProgress from '@/components/ql-progress';
export default {
	name: 'locate',
	components: {
		QlProgress
	},
	computed: {
		step () {
			return this.$route.meta.step;
		}
	}
};
</script>
