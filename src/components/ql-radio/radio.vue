<style lang="less" scoped>
.radio {
	position: relative;
	display: inline-block;
	height: 44px;
	padding: 0 26px;
	margin: 0 30px 10px 0;
	font-size: 16px;
	line-height: 44px;
	letter-spacing: 2px;
	border: solid 1px #d2d2d2;
	border-radius: 4px;
	color: #515151;
	text-align: center;
	font-family: 'heiti';
	cursor: pointer;

	.radio-checked-wrapper {
		position: absolute;
		right: 0;
		bottom: 0;
		.radio-checked {
			position: absolute;
			display: block;
			right: 0;
			bottom: 0;
			width: 0;
			height: 0;
			border-left: 16px solid transparent;
			border-right: 16px solid #c3a451;
			border-top: 12px solid transparent;
			border-bottom: 12px solid #c3a451;
			line-height: 24px;
		}
		.radio-checked-icon {
			position: absolute;
			right: 2px;
			bottom: 0;
		}
	}

}
</style>

<template>
	<div class="radio" @click="change">
		<slot>{{ label }}</slot>
		<div class="radio-checked-wrapper" v-show="isActive">
			<div class="radio-checked"></div>
			<Icon type="ios-checkmark-empty" size="20" color="#fff" class="radio-checked-icon"></Icon>
		</div>
	</div>
</template>

<script>
export default {
	name: 'qlRadio',
	props: {
		label: {
			type: [String, Number]
		},
		value: {
			type: [String, Number, Boolean],
			required: true
		}
	},
	data () {
		return {
			currentValue: this.value
		};
	},
	computed: {
		isActive () {
			return this.currentValue === this.value;
		}
	},
	mounted () {
		this.$parent.updateValue();
	},
	methods: {
		change (e) {
			this.currentValue = this.value;
			this.$parent.change(this.value);
		},
		updateValue (v) {
			this.currentValue = v;
		}
	}
};
</script>

