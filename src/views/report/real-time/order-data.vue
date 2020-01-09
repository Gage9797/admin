<style lang="less" scoped>
@import '../common.less';

/deep/ .card-content-p {
	line-height: 120px;
	text-align: center;
	.card-content-num {
		font-weight: bold;
		font-size: 48px;
		color: #495060;
		word-break: break-all;
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
  <div class="padding-top-10">
	<i-row class="margin-bottom-10">
		<i-tag color="blue">今日实时营收数据（今日 {{ beginTime|formatTime }} ~ 更新时间 {{ endTime|formatTime }}）</i-tag>
	</i-row>
	<Row :gutter="16">
		<Col span="6">
			<Card :shadow="true">
				<p slot="title">
					营收总额
				</p>
				<Tooltip slot="extra">
					<Icon type="help-circled" />
					<p style="white-space: normal; width: 240px;" slot="content">
						营收总额=开台订单实际营收金额+商品售出订单实际营收金额（不包括退款金额）
					</p>
				</Tooltip>
				<p class="card-content-p">
					<span class="card-content-num">{{ count.revenueSales | formatPrice }}</span> 元
				</p>
			</Card>
		</Col>
		<Col span="6">
			<Card :shadow="true">
				<p slot="title">
					结账单数
				</p>
				<Tooltip slot="extra" content="结账单数=开台结账单数+商售结账单数">
					<Icon type="help-circled" />
				</Tooltip>
				<p class="card-content-p">
					<span class="card-content-num">{{ count.billNum }}</span> 单
				</p>
			</Card>
		</Col>
		<Col span="6">
			<Card :shadow="true">
				<p slot="title">
					开台单数
				</p>
				<p class="card-content-p">
					<span class="card-content-num">{{ count.openNum }}</span> 单
				</p>
			</Card>
		</Col>
		<Col span="6">
			<Card :shadow="true">
				<p slot="title">
					商售单数
				</p>
				<p class="card-content-p">
					<span class="card-content-num">{{ count.seltNum }}</span> 单
				</p>
			</Card>
		</Col>
	</Row>
	<Row :gutter="16" style="margin-top: 30px;">
		<Col span="8">
			<Card :shadow="true">
				<p slot="title">
					实时开台情况
				</p>
				<ul class="progress-bar-wrapper">
					<li>
						<Row type="flex" justify="space-between">
							<Col>包间开单数：{{ count.roomOpenNum }}笔</Col>
							<Col>散座开单数：{{ count.seatOpenNum }}笔</Col>
						</Row>
					</li>
					<li>
						<i-progress :percent="roomOpenRatio" hide-info status="active"/>
					</li>
				</ul>
			</Card>
		</Col>
		<Col span="8">
			<Card :shadow="true" class="card-chart">
				<p slot="title">
					消费类型
				</p>
				<pie-chart
					idName="consumption-type-realtime"
					:option="consumptionPieOption"
					ref="consumptionPiePirChart"
				/>
			</Card>
		</Col>
		<Col span="8">
			<Card :shadow="true" class="card-chart">
				<p slot="title">
					支付方式
				</p>
				<pie-chart
					idName="pay-way-realtime"
					:option="payWayPieOption"
					ref="payWayPieChart"
				/>
			</Card>
		</Col>
	</Row>
	<!-- 叠加折线图表 -->
	<i-row :style="{height: '400px'}" class="margin-top-20">
		<stacked-line-chart
			idName="open-per-time"
			:option="stackedLineOption"
			ref="openPerTimeLine"
		/>
	</i-row>

	<i-row :style="{height: '400px'}" class="margin-top-20">
		<stacked-line-chart
			idName="revenue-per-time"
			:option="stackedLineOption"
			ref="revenuePerTimeLine"
		/>
	</i-row>
  </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import { formatPrice } from '@/tools';
import PieChart from '../components/chart-pie';
import StackedLineChart from '../components/chart-stacked-line';
import { COLOR_ARRAY } from '../components/color-variable';

export default {
	name: 'real-data-in-real-time',
	filters: {
		formatTime (time) {
			let date = new Date(time);
			return dateTools.format('hh:mm', date);
		},
		formatPrice (v) {
			return formatPrice(v);
		}
	},
	data () {
		return {
			beginTime: 0,
			endTime: 0,
			count: {
				billNum: 0,
				openNum: 0,
				revenueSales: 0,
				roomOpenNum: 0,
				seatOpenNum: 0,
				seltNum: 0
			},
			consumptionPieOption: {},
			payWayPieOption: {},
			stackedLineOption: {}
		};
	},

	computed: {
		roomOpenRatio () {
			const { roomOpenNum, seatOpenNum } = this.count;
			let sum = parseInt(roomOpenNum) + parseInt(seatOpenNum);
			if (sum === 0) {
				return 0;
			} else {
				return (parseInt(roomOpenNum) / sum) * 100;
			}
		}
	},
	components: {
		PieChart,
		StackedLineChart
	},
	methods: {
		getPieDataAndInitPie () {
			// 消费类型饼图
			this.$request.post('/realtime/order/consumptionType')
				.then(res => {
					if (res.errCode === '000000') {
						let option = {
							series: [
								{
									name: '消费类型',
									data: res.result.data.map((item, index) => Object.assign({itemStyle: {normal: { color: COLOR_ARRAY[index % 4] }}}, item))
								}
							]
						};
						this.$refs.consumptionPiePirChart.init(option);
					} else {
						this.$Message.warning(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});

			// 支付方式饼图
			this.$request.post('/realtime/order/payWay')
				.then(res => {
					if (res.errCode === '000000') {
						let option = {
							series: [
								{
									name: '支付方式',
									data: res.result.data.map((item, index) => Object.assign({itemStyle: {normal: { color: COLOR_ARRAY[index % 4] }}}, item))
								}
							]
						};
						this.$refs.payWayPieChart.init(option);
					} else {
						this.$Message.warning(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getLineDataAndInit () {
			// 每单位时间 开台 情况折线图
			this.$request.post('/realtime/order/openNumPerTime')
				.then(res => {
					if (res.errCode === '000000') {
						const result = res.result;
						let option = {
							title: {
								text: '每单位时间开台情况'
							},
							legend: {
								data: result.data.map(item => item.name)
							},
							yAxis: {
								minInterval: 1,
								name: '数量'
							},
							xAxis: {
								name: '时间',
								data: result.xAxis
							},
							series: result.data
						};

						this.$refs.openPerTimeLine.init(option);
					} else {
						this.$Message.warning(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});

			// 每单位时间 营收 情况折线图
			this.$request.post('/realtime/order/salesPerTime')
				.then(res => {
					if (res.errCode === '000000') {
						const result = res.result;
						let option = {
							title: {
								text: '每单位时间段营收情况'
							},
							legend: {
								data: result.data.map(item => item.name)
							},
							yAxis: {
								name: '元'
							},
							xAxis: {
								name: '时间',
								data: result.xAxis
							},
							series: result.data
						};

						this.$refs.revenuePerTimeLine.init(option);
					} else {
						this.$Message.warning(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	created () {
		this.getPieDataAndInitPie();
		this.getLineDataAndInit();

		this.$request.post('/realtime/order/cardData')
			.then(res => {
				if (res.errCode === '000000') {
					const data = res.result;
					this.beginTime = data.beginTime;
					this.endTime = data.endTime;

					this.count.billNum = data.billNum;
					this.count.openNum = data.openNum;
					this.count.revenueSales = data.revenueSales;
					this.count.roomOpenNum = data.roomOpenNum;
					this.count.seatOpenNum = data.seatOpenNum;
					this.count.seltNum = data.seltNum;
				} else {
					this.$Message.warning(res.errMsg);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
};
</script>
