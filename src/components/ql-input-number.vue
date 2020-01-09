<template>
	<div class="ql-input-number">
		<Icon
			type="minus-circled"
			size="15"
			color="#c3a451"
			style="cursor: pointer"
			@click.native="handleDecrease"
			>
		</Icon>
		<input
			v-model="number"
			type="text"
			class="ql-input"
			@change="handleChange"
			>
		<Icon
			type="plus-circled"
			size="15"
			color="#c3a451"
			style="cursor: pointer"
			@click.native="handleAdd"
			>
		</Icon>
	</div>
</template>
<script>
export default {
	name: 'ql-input-number',
	props: {
		value: {
			type: Number,
			default: 0
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number
		}
	},
	data () {
		return {
			number: this.value
		};
	},
	methods: {
		handleDecrease () {
			if (!(isNaN(parseInt(this.number)))) {
				this.number = parseInt(this.number);
				if (this.number > this.min) {
					this.number = this.number - 1;
					this.$emit('input', this.number);
				}
			} else {
				this.number = this.min;
				this.$emit('input', this.number);
			}
		},
		handleAdd () {
			if (!(isNaN(parseInt(this.number)))) {
				this.number = parseInt(this.number);
				if (this.max && this.number >= this.max) {
					this.number = this.max;
				} else {
					this.number = this.number + 1;
				}
			} else {
				this.number = this.min;
			}
			this.$emit('input', this.number);
		},
		handleChange () {
			if (!(isNaN(parseInt(this.number)))) {
				this.number = parseInt(this.number);
				if (this.number < this.min) {
					this.number = this.min;
				}
				if (this.max && this.number > this.max) {
					this.number = this.max;
				}
			} else {
				this.number = this.min;
			}
			this.$emit('input', this.number);
		}
	}
};
</script>
<style lang="less" scoped>
.ql-input-number {
	display: inline-block;
	width: 96px;
	height: 24px;
	.ql-input {
		width: 60px;
		height: 20px;
		font-size: 14px;
		outline: none;
		border: none;
		border-radius: 5px;
		text-align: center;
	}
}
</style>
