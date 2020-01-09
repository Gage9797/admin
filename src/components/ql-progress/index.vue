<style lang="less" scoped>
.after-arrow {
	position: absolute;
	right: -12px;
	top: 0;
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 13px solid #e5e5e5;
	border-top: 18px solid transparent;
	border-bottom: 18px solid transparent;
}
.before-arrow {
	position: absolute;
	left: -12px;
	top: 0;
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 13px solid transparent;
	border-top: 18px solid #e5e5e5;
	border-bottom: 18px solid #e5e5e5;
}

.progress {
	position: relative;
	display: inline-block;
	width: 120px;
	height: 36px;
	font-size: 14px;
	line-height: 36px;
	letter-spacing: 1px;
	text-align: center;
	background-color: #e5e5e5;
	color: #7f7f7f;

	&.first {
		width: 108px;
		margin-right: 12px;
		&::after {
			.after-arrow;
		}
	}
	&.between {
		width: 96px;
		margin: 0 12px;
		&::after {
			.after-arrow;
		}
		&::before {
			.before-arrow;
		}
	}
	&.last {
		width: 108px;
		margin-left: 12px;
		&::before {
			.before-arrow;
		}
	}

	&.active {
		color: #434342;
		background-color: #e8c66b;
		&.first {
			width: 108px;
			margin-right: 12px;
			&::after {
				.after-arrow;
				border-left-color: #e8c66b;
			}
		}
		&.between {
			width: 96px;
			margin: 0 12px;
			&::after {
				.after-arrow;
				border-left-color: #e8c66b;
			}
			&::before {
				.before-arrow;
				border-top-color: #e8c66b;
				border-bottom-color: #e8c66b;
			}
		}
		&.last {
			width: 108px;
			margin-left: 12px;
			&::before {
				.before-arrow;
				border-top-color: #e8c66b;
				border-bottom-color: #e8c66b;
			}
		}
	}
}
</style>

<template>
	<div class="progress" @click="clickHandler">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'qlProgress',
	methods: {
		clickHandler (e) {
			this.$emit('on-click', e);
		}
	}
};
</script>

