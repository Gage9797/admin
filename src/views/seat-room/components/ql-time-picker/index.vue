<style lang="less" scoped>
@import './style.less';

</style>

<template>
  	<div class="ql-time-picker">
		<Dropdown placement="bottom-start" trigger="custom" :visible="visible" v-clickoutside="handleClose">
			<i-input
				v-model="currentTimerange"
				@on-focus="handleOpen"
				@on-input-change="handleChange">

			</i-input>
			<DropdownMenu slot="list">
				<time-panel
					ref="timePanel"
					:nowDayIndex="nowDayIndex"
					:reserveList="reserveList"
					:start="start"
					:end="end"
					@on-choose="setValue"/>
			</DropdownMenu>
		</Dropdown>
  </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import clickoutside from './click-outside';
import TimePanel from './time-panel';

export default {
	name: 'ql-time-picker',
	props: {
		nowDayIndex: {
			type: Number,
			default: 0
		},
		reserveList: {
			type: Array,
			default: () => []
		},
		value: {
			type: [String, Array],
			default: ''
		},
		start: {
			type: Number,
			required: true
		},
		end: {
			type: Number,
			required: true
		}
	},
	directives: { clickoutside },
	components: {
		TimePanel
	},
	data () {
		return {
			currentTimerange: '',
			ifShowSelect: false,
			visible: false,
			checkArray: []
		};
	},
	created () {
		this.formatCurrentValue(this.value);
	},
	methods: {
		formatCurrentValue (v) {
			if (v === '' || v[0] === '' || v.length === 0) {
				this.currentTimerange = '';
			} else {
				let start = dateTools.format('hh:mm', v[0]);
				let end = dateTools.format('hh:mm', v[1]);
				this.currentTimerange = start + ' - ' + end;
			}
		},
		handleChange (event) {
			this.currentTimerange = '';
		},
		setValue (startTimestamp, endTimestamp, min, max) {
			if (startTimestamp === '') {
				// clear time
				this.formatCurrentValue(startTimestamp);
				this.$emit('input', '');
			} else {
				const startDate = new Date(startTimestamp);
				const endDate = new Date(endTimestamp);
				this.formatCurrentValue([startDate, endDate]);
				this.checkArray = [min, max];
				this.visible = false;
				this.$emit('input', [startDate, endDate]);
				this.dispatchValidator();
			}
		},
		handleOpen () {
			this.visible = true;
		},
		handleClose (e) {
			if (this.visible) {
				if (this.checkArray.length === 2) {
					this.$refs.timePanel.check(this.checkArray[0], this.checkArray[1]);
				}
				this.visible = false;
				this.dispatchValidator();
			}
		},
		dispatchValidator () {
			const componentName = 'FormItem';
			const eventName = 'on-form-blur';

			let parent = this.$parent || this.$root;
			let name = parent.$options.name;

			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if (parent) {
					name = parent.$options.name;
				}
			}
			if (parent) {
				parent.$emit.apply(parent, [eventName].concat());
			}
		}
	},
	watch: {
		value: function (v) {
			if (Array.isArray(v) && v.length === 0 && this.nowDayIndex === 0) {
				// 每次打开弹框前，nowDayIndex = 0 && v = []，表示 reset 时间面板。
				this.$refs.timePanel.reset();
			}
			this.formatCurrentValue(v);
		}
	}
};
</script>
