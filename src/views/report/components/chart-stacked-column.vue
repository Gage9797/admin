
<template>
  <div style="width:100%;height:100%;" :id="idName"></div>
</template>

<script>
import echarts from 'echarts';
import object from 'lodash/fp/object';

let defaultOption = {
	title: {
		text: ''
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	legend: {
		data: []
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [
		{
			type: 'category',
			data: []
		}
	],
	yAxis: [
		{
			type: 'value'
		}
	],
	series: [],
	toolbox: {
		right: 20,
		feature: {
			magicType: {
				type: ['stack', 'tiled']
			}
		}
	}
};

export default {
	name: 'chart-statcked-column',
	props: {
		idName: String
	},
	data () {
		return {
			chart: null
		};
	},
	methods: {
		init (option) {
			if (typeof option === 'undefined') {
				this.initHelper(defaultOption);
			} else {
				this.initHelper(object.merge(defaultOption, option));
			}
		},
		initHelper (option) {
			this.$nextTick(() => {
				if (!this.chart) {
					this.chart = echarts.init(document.getElementById(this.idName));
					window.addEventListener('resize', () => {
						this.chart.resize();
					});
				}
				this.chart.setOption(option);
			});
		}
	}
};
</script>
