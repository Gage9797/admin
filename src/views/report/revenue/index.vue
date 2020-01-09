<style lang="less" scoped>
@import "../common.less";

#revenue-report {
	min-width: 1024px;
	background-color: #e4e4e2;
	border-radius: 15px;
	.top-area {
		border-bottom: 1px solid #d8d8d6;
		padding: 15px;
		color: #7b7256;
	}
	.bottom-area {
		padding: 15px;
	}
}

/deep/ .card-content-p {
	// line-height: 120px;
	padding: 24px 0;
	text-align: center;
	word-break: break-all;
	.card-content-num {
		font-weight: bold;
		font-size: 48px;
		color: #495060;
	}
}

.progress-bar-wrapper {
	height: 180px;
	padding-top: 60px;
}

.card-chart {
	/deep/ .ivu-card-body {
		height: 300px;
	}
}
</style>

<template>
  <is-sit-version v-if="!canUse"/>
  <div id="revenue-report" v-else>
    <div class="bottom-area">
      <!-- table -->
      <i-row class="margin-top-20" type="flex" justify="space-between">
        <i-col span="4">
          <h2>门店业绩报表</h2>
        </i-col>
        <i-col span="2">
          <div>
            <i-button type="primary" style="width: 100%;" @click="exportExcel">导出EXCEL</i-button>
          </div>
        </i-col>
      </i-row>
      <i-row class="margin-top-8">
        <i-table
          border
          height="400"
          ref="tableExcel"
          id="revenueTable"
          :columns="achivementsCol"
          :data="achivementsData"
        />
      </i-row>
    </div>
  </div>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';
import PieChart from '../components/chart-pie';
import StackedLineChart from '../components/chart-stacked-line';
import Mixins from '../mixins';

import { exportTableToExcell } from '@/libs/tableToExcel';
import { resetTableHeight, formatPrice } from '@/tools';
import { COLOR_ARRAY } from '../components/color-variable';
import moment from 'moment';
export default {
	name: 'revenue-report',
	mixins: [Mixins],
	data () {
		return {
			revenueSales: 0,
			billNum: 0,
			openNum: 0,
			seltNum: 0,
			roomOpenNum: 0,
			seatOpenNum: 0,
			daterange: [],
			achivementsCol: [
				{
					title: '时间',
					key: 'date'
				},
				{
					title: '结账总单数',
					key: 'totalNum'
				},
				{
					title: '营收总额',
					key: 'revenue'
				},
				{
					title: '包间营收额',
					key: 'roomRevenue'
				},
				{
					title: '散座营收额',
					key: 'seatRevenue'
				}
			],
			achivementsData: []
		};
	},
	components: {
		IsSitVersion,
		PieChart,
		StackedLineChart
	},
	computed: {
		roomOpenRatio () {
			const roomOpenNum = this.roomOpenNum;
			const seatOpenNum = this.seatOpenNum;

			let sum = parseInt(roomOpenNum) + parseInt(seatOpenNum);
			if (sum === 0) {
				return 0;
			} else {
				return (parseInt(roomOpenNum) / sum) * 100;
			}
		}
	},
	methods: {
		getTableDataAndInit () {
			console.log(moment('2020-01-08 22:55:41').format('YYYY-MM-DD'));
			this.$http.request(this, 'POST', '/teaOrder/getTeaOrderList')
				.then(res => {
					if (res.data.errCode === '000000') {
						let date = [];
						let arr = [];
						let list = [];
						arr = JSON.parse(JSON.stringify(res.data.data.orderList));
						arr.forEach(item => {
							if (item.state === '0') {
								item.goods = JSON.parse(item.goods);
								list.push(item);
							}
						});
						list.forEach(item => {
							if (!date.includes(moment(item.endTime).format('YYYY-MM-DD'))) {
								date.push(moment(item.endTime).format('YYYY-MM-DD'));
							}
						});
						console.log('date', arr);
						let revenue = 0;
						let roomRevenue = 0;
						let seatRevenue = 0;
						let newArr = [];
						date.forEach((item, index) => {
							list.forEach(itm => {
								if (item === moment(itm.endTime).format('YYYY-MM-DD')) {
									itm.goods.forEach(i => {
										revenue = revenue + parseInt(i.unitPrice) * parseInt(i.goodCode);
									});
									if (!item.tableId) {
										itm.goods.forEach(i => {
											roomRevenue = roomRevenue + parseInt(i.unitPrice) * parseInt(i.goodCode);
										});
									} else {
										itm.goods.forEach(i => {
											seatRevenue = seatRevenue + parseInt(i.unitPrice) * parseInt(i.goodCode);
										});
									}
									console.log('12');
									newArr[index] = {
										date: item, totalNum: list.length, revenue: revenue, roomRevenue: roomRevenue, seatRevenue: seatRevenue
									};
								}
							});
						});
						newArr.forEach(item => {
							this.achivementsData.push(item);
						});
						console.log('this.achivementsData', this.achivementsData);
						// this.achivementsData = res.data.data.orderList;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		exportExcel () {
			const params = {
				title: this.achivementsCol.map(item => item.title),
				key: this.achivementsCol.map(item => item.key),
				data: this.achivementsData,
				autoWidth: true,
				filename: '门店业绩报表'
			};
			exportTableToExcell(params);
		},
		search () {
			// this.getPieDataAndInitPie();
			// this.getLineDataAndInit();
			// this.getCardData();
			this.getTableDataAndInit();
		}
	}
};
</script>
