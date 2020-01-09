<template>
  <div style="width:100%;height:100%;" :id="idName"></div>
</template>

<script>
import echarts from 'echarts';
import object from 'lodash/fp/object';

let defaultOption = {
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b} : {c} ({d}%)'
	},
	series: [
		{
			name: '',
			type: 'pie',
			// roseType: true,
			radius: '66%',
			center: ['50%', '50%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
	]
};

export default {
	name: 'chart-pie',
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
