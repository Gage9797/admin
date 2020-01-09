<style lang="less" scoped>
.radio {
	display: inline-block;
}
</style>

<template>
	<div class="radio-group">
		<slot />
	</div>
</template>

<script>
import { findComponentsDownward } from '@/tools';

export default {
	name: 'qlRadioGrouop',
	props: {
		value: {
			type: [String, Number, Boolean],
			default: false
		}
	},
	data () {
		return {
			currentValue: this.value,
			children: []
		};
	},
	mounted () {
		this.updateValue();
	},
	methods: {
		updateValue () {
			const value = this.value;
			this.children = findComponentsDownward(this, 'qlRadio');
			if (this.children) {
				this.children.forEach(child => {
					child.currentValue = value;
				});
			}
		},
		change (value) {
			this.currentValue = value;
			this.updateValue();
			this.$emit('input', value);
			this.$emit('on-change', value);
		}
	},
	watch: {
		value: function () {
			this.updateValue();
		}
	}
};
</script>

