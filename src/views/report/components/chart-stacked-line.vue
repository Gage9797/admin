
<template>
  	<div style="width:100%; height:100%;" :id="idName"></div>
</template>

<script>
import echarts from 'echarts';
import object from 'lodash/fp/object';

let defaultOption = {
	title: {
		text: ''
	},
	tooltip: {
		trigger: 'axis'
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
	toolbox: {
		right: 20,
		feature: {
			saveAsImage: {}
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: []
	},
	yAxis: {
		type: 'value'
	},
	series: []
};

export default {
	name: 'chart-statcked-line',
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
