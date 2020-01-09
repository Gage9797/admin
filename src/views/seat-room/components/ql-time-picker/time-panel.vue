<style lang="less" scoped>
.time-panel {
	width: 220px;
	padding: 10px;

	&-cell {
		display: inline-block;
		width: 40px;
		height: 48px;
		padding-top: 4px;
		border-radius: 3px;
		cursor: pointer;

		em {
			display: inline-block;
			width: 40px;
			height: 40px;
			line-height: 40px;
			font-size: 12px;
			text-align: center;
			border-radius: 3px;
		}

		&-free:hover {
			em {
				color: #fff;
				background-color: #cab26f;
			}
		}
		&-overtime {
			background-color: #f7f7f7;
			color: #c3cbd6;
		}
		&-selected {
			background: #c3a451;
			color: #fff;
		}
		&-range {
			em {
				background: #cab26f;
				color: #fff;
				border-radius: 0;
			}
		}
	}
}

</style>

<template>
	<div class="time-panel">
		<template v-for="(time, index) in timeList">
			<span
				:key="time.key"
				:class="[
					{'time-panel-cell-overtime': time.state === 0 || time.state === 1},
					{'time-panel-cell-selected': time.state === 2},
					{'time-panel-cell-range': isInRange(index)},
					{'time-panel-cell-free': time.state === 3},
					'time-panel-cell'
				]"
				@click="hanlderClick(index)"
				@mouseover="hanlderMouseover(index)">
				<em>{{ time.time | formatTime }}</em>
			</span>
		</template>
	</div>
</template>

<script>
const IS_OVERTIME = 0;
const IS_RESERVED = 1;
const IS_SELECTED = 2;
const IS_FREE = 3;

export default {
	name: 'timePanel',
	filters: {
		formatTime (t) {
			const date = new Date(t);
			let h = date.getHours();
			let m = date.getMinutes();
			const H = h < 10 ? '0' + h : h;
			const M = m === 0 ? '0' + m : m;
			return H + ':' + M;
		}
	},
	props: {
		nowDayIndex: {
			type: Number,
			default: 0
		},
		reserveList: {
			type: Array,
			default: () => []
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
	data () {
		return {
			timeList: [],
			chooseList: []
		};
	},
	methods: {
		genTimeList (nowDayIndex = 0) {
			const timeList = [];
			let today = new Date();

			// 茶馆开始/结束时间 h:m
			const s = new Date(this.start);
			const e = new Date(this.end);

			today.setDate(today.getDate() + nowDayIndex);	// 今天加上 往后的第几天
			today.setHours(s.getHours(), s.getMinutes(), 0, 0);					// 因为 Date.now 获得的时间戳不一定格式 s ms 都为0的。为后边的比较做处理。

			let endTimePoint = new Date(today.getTime());	// 确保是同一天
			endTimePoint.setHours(e.getHours(), e.getMinutes(), 0, 0);

			for (let i = 0, offset = 30 * 60 * 1000, t = null, now = Date.now(); today.getTime() <= endTimePoint.getTime(); i++) {
				t = today.getTime();
				timeList.push({
					key: Math.random(),
					time: t,
					state: nowDayIndex === 0 ? (t < now ? IS_OVERTIME : IS_FREE) : IS_FREE
				});
				today.setTime(today.getTime() + offset);
			}

			// 处理已被预订的时间点。bug：毫秒 + 秒 不一定为0，因而不能直接比较是否相等。
			const toDayReserveList = this.reserveList[nowDayIndex] || [];
			const LEN_OF_TIME_ITEM = timeList.length;	// 时间面板时间点 个数
			toDayReserveList.forEach((item, index) => {
				let startIndex = timeList.findIndex(timeObj => timeObj.time === parseInt(item.start));
				let endIndex = timeList.findIndex(timeObj => timeObj.time === parseInt(item.end));
				for (let i = startIndex + 1; i < endIndex; i++) {
					timeList[i].state = IS_RESERVED;
				}
			});

			/**
			 * !!! 处理边界条件
			 * 如果在连续的时间段里，只有中间存在少于 三个 可用的时间点，那么这些时间点也将不可用。（用 IS_RESERVED 标记不可用）
			 * 在遍历之后，头部单独处理。
			 */
			function invalid (state) {
				return state === IS_OVERTIME || state === IS_RESERVED;
			}

			// TODO: 这段代码怎么跟*一样。。
			for (let i = 1; i < LEN_OF_TIME_ITEM;) {
				if (invalid(timeList[i - 1].state)) {
					// 间隔的开始是上一个不可用
					const next1 = i + 1;	// 下一个
					const next2 = i + 2;	// 下两个
					if (next2 < LEN_OF_TIME_ITEM && invalid(timeList[next2].state)) {
						// 后边还有两个以上，并且后边第二个不可用，该段时间作废。
						timeList[i].state = IS_RESERVED;
						timeList[next1].state = IS_RESERVED;
						i = i + 3;
					} else if (next1 < LEN_OF_TIME_ITEM) {
						if (next1 === LEN_OF_TIME_ITEM - 1) {
							// 最后剩余两项
							timeList[i].state = IS_RESERVED;
							timeList[next1].state = IS_RESERVED;
							i = i + 2;
						} else if (invalid(timeList[next1].state)) {
							// 剩余多余两项 并且 下一个是不可用的，在中间的当前不可用。
							timeList[i].state = IS_RESERVED;
							i = i + 2;
						} else {
							i++;
						}
					} else if (i === LEN_OF_TIME_ITEM - 1) {
						// 当前是最后一个，当前不可用
						timeList[i].state = IS_RESERVED;
						i++;
					} else {
						i++;
					}
				} else {
					i++;
				}
			}

			if (timeList[0].state === IS_FREE) {
				if (invalid(timeList[1].state)) {
					timeList[0].state = IS_RESERVED;
				} else if (invalid(timeList[2].state)) {
					timeList[0].state = IS_RESERVED;
					timeList[1].state = IS_RESERVED;
				}
			}

			this.timeList = timeList;
		},
		hanlderClick (index) {
			const timeList = this.timeList;
			const SELECT_STATE = timeList[index].state;

			let chooseList = this.chooseList;
			// 过时 | 已被预订
			if (SELECT_STATE === IS_OVERTIME || SELECT_STATE === IS_RESERVED) {
				return false;
			}
			if (chooseList.length === 2) {
				// 释放被选择的时间段
				timeList[chooseList[0]].state = timeList[chooseList[1]].state = IS_FREE;
				chooseList = this.chooseList = [];
			}

			if (chooseList.length === 0) {
				// 选择第一个时间点时
				chooseList.push(index);
				timeList[index].state = IS_SELECTED;
			} else {
				if (index === chooseList[0]) {
					// 重复点击同一个时间点判断为 取消
					chooseList = this.chooseList = [];
					timeList[index].state = IS_FREE;
				} else if (Math.abs(index - chooseList[0]) <= 1) {
					// 最少时间段
					this.$Message.info('所选时间段不能少于1个小时。');
				} else if (isValidPhase(index, chooseList[0])) {
					chooseList.push(index);
					timeList[index].state = IS_SELECTED;
					const MIN = Math.min(chooseList[0], chooseList[1]);
					const MAX = Math.max(chooseList[0], chooseList[1]);
					this.$emit('on-choose', timeList[MIN].time, timeList[MAX].time, MIN, MAX);
				}
			}

			// 是否包含了已被预订时间段
			function isValidPhase (index1, index2) {
				const min = Math.min(index1, index2);
				const max = Math.max(index1, index2);

				for (let i = min + 1; i < max; i++) {
					if (timeList[i].state === IS_RESERVED) {
						return false;
					}
				}
				return true;
			}
		},
		hanlderMouseover (index) {
			// if (this.chooseList.length === 1) {
			// 	const begin
			// }
		},
		isInRange (index) {
			if (this.chooseList.length === 2) {
				const i = this.chooseList[0];
				const j = this.chooseList[1];
				if ((index > i && index < j) || (index > j && index < i)) {
					return true;
				}
			}
			return false;
		},
		check (min, max) {
			// 未选定两个时退掉时间面板，重置为上一个时间点
			const chooseList = this.chooseList;
			if (chooseList.length === 1) {
				const timeList = this.timeList;
				timeList[chooseList[0]].state = IS_FREE;
				timeList[min].state = timeList[max].state = IS_SELECTED;
				this.chooseList = [min, max];
			}
		},
		reset (index) {
			this.$nextTick(() => {
				// 重置放在数据更新后（数据在nextTick中更新）
				this.chooseList = [];
				this.$emit('on-choose', '');
				this.genTimeList(index);
			});
		}
	},
	watch: {
		nowDayIndex: function (v) {
			if (v !== -1) {
				this.reset(v);
			}
		},
		start: function (v) {
			if (v !== -1) {
				this.genTimeList(this.nowDayIndex);
			}
		}
	}
};
</script>
