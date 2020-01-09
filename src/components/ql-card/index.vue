<style lang="less" scoped>
.card {
	position: absolute;
	left: 50%;
	top: 50%;
	// min-width: 510px;
	transform: translate(-50%, -50%);
	&-header{
		box-sizing: border-box;
		height: 108px;
		line-height: 108px;
		font-size: 24px;
		letter-spacing: 3px;
		border-radius: 20px 20px 0 0;
		color: #c2a558;
		background-color: #363e4f;
		text-align: center;

		&-icon {
			display: inline-block;
			width: 42px;
			height: 40px;
			margin-right: 14px;
			vertical-align: middle;
			background-image: url('../../images/login-logo.png');
			background-size: cover;
		}
	}
	&-body{
		background-color: #f4f4f3;
		padding: 35px 70px;
		// text-align: center;
	}
}
</style>

<template>
	<div class="card">
		<header class="card-header">
			<i class="card-header-icon"></i>
			<span :style="{fontSize: size + 'px'}">{{ title }}</span>
		</header>
		<div class="card-body">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'qlCard',
	props: {
		title: {
			type: String,
			default: ''
		},
		size: {
			type: Number,
			default: 24
		}
	},
	data () {
		return {

		};
	}
};
</script>
