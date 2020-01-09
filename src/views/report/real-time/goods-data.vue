<style lang="less" scoped>
.radio-group-wrapper {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

/deep/ .card-content-p {
	line-height: 120px;
	text-align: center;
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
  <div class="padding-top-10">
    <i-row class="margin-bottom-10">
      	<i-tag color="blue">今日实时营收数据（今日 {{ beginTime|formatTime }} ~ 更新时间 {{ endTime|formatTime }}）</i-tag>
    </i-row>
    <i-row :gutter="48" class="margin-top-8">
		<i-col span="8">
			<i-card :shadow="true">
			<p slot="title">销售总额</p>
			<i-tooltip slot="extra">
				<i-icon type="help-circled"/>
				<p style="white-space: normal; width: 240px;" slot="content">
					销售总额=全部售出商品的实际营收总额（不包括退款金额）
				</p>
			</i-tooltip>
			<p class="card-content-p">
				<span class="card-content-num">{{ sales | formatPrice }}</span> 元
			</p>
			</i-card>
      	</i-col>
		<i-col span="8">
			<i-card :shadow="true">
			<p slot="title">点餐商品销售额</p>
			<i-tooltip slot="extra">
				<i-icon type="help-circled"/>
				<p style="white-space: normal; width: 240px;" slot="content">
					点餐商品销售额=售出点餐商品的实际营收额（不包括退款金额）
				</p>
			</i-tooltip>
			<p class="card-content-p">
				<span class="card-content-num">{{ mealSales | formatPrice }}</span> 元
			</p>
			</i-card>
		</i-col>
		<i-col span="8">
			<i-card :shadow="true">
			<p slot="title">零售商品销售额</p>
			<i-tooltip slot="extra" placement="left-start">
				<i-icon type="help-circled"/>
				<p style="white-space: normal; width: 240px;" slot="content">
					零售商品销售额=单独售出商品的实际营收额（不包括退款金额）
				</p>
			</i-tooltip>
			<p class="card-content-p">
				<span class="card-content-num">{{ retailSales | formatPrice }}</span> 元
				</p>
			</i-card>
		</i-col>
    </i-row>

    <!-- 两个柱状图 begin -->
    <i-row class="margin-top-20">
      <div class="radio-group-wrapper">
        <i-radio-group
          v-model="goodsClassRadio"
          @on-change="chartClassChange"
          size="large"
          class="padding-left-10 margin-bottom-10"
        >
          <i-radio label="num">
            <span>销售数量</span>
          </i-radio>
          <i-radio label="sales">
            <span>销售额</span>
          </i-radio>
        </i-radio-group>
      </div>
      <stacked-column-chart
        idName="realtime-goods-class-top10"
        ref="goodsClassTop10"
        :style="{height: '400px'}"
      />
    </i-row>

    <i-row class="margin-top-20">
      <div class="radio-group-wrapper">
        <i-radio-group
          v-model="goodsNameRadio"
          @on-change="chartNameChange"
          size="large"
          class="padding-left-10 margin-bottom-10"
        >
          <i-radio label="num">
            <span>销售数量</span>
          </i-radio>
          <i-radio label="sales">
            <span>销售额</span>
          </i-radio>
        </i-radio-group>
      </div>
      <stacked-column-chart
        idName="realtime-goods-name-top10"
        ref="goodsNameTop10"
        :style="{height: '400px'}"
      />
    </i-row>
    <!-- 两个柱状图 end -->
    <!-- 表格 begin -->
    <i-row class="margin-top-10 margin-bottom-10">
      <!-- <i-tag color="blue">实时商品销售排行情况</i-tag> -->
    </i-row>
    <i-tabs type="card">
      <i-tab-pane label="商品排行" class="padding-left-10">
        <div class="margin-top-8">
          <span style="font-size: 16px; font-weight: bold;">商品类别</span>
          <i-select
            style="width: 200px"
            class="margin-left-10"
            v-model="classValue"
            @on-change="tableClassChange"
          >
            <i-option value="0">全部</i-option>
            <i-option v-for="(l, i) in classList" :key="i" :value="l.id">{{ l.name }}</i-option>
          </i-select>
        </div>

        <i-table
          border
          :columns="goodsRankCol"
          :data="goodsRankDataOfClassSelected"
          class="margin-top-8"
        />
      </i-tab-pane>

      <i-tab-pane label="类别排行" class="padding-left-10">
        <i-table border :columns="classRankCol" :data="classRankData" class="margin-top-8"/>
      </i-tab-pane>
    </i-tabs>
    <!-- 表格 end -->
  </div>
</template>

<script>
import StackedColumnChart from '../components/chart-stacked-column';
import dateTools from '@/tools/dateTools';
import { formatPrice } from '@/tools';

export default {
	name: 'goods-data-in-real-time',
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
			mealSales: 0,
			retailSales: 0,
			sales: 0,

			// 柱状图相关 商品类别Top10
			goodsClassRadio: 'num',
			goodsNameRadio: 'num',
			classTop10Option: {
				num: {},
				sales: {}
			},
			nameTop10Option: {
				num: {},
				sales: {}
			},
			// 表格相关
			classValue: '0',
			classList: [], // 实时商品数据的表格中，商品排行 所需的商品类别的筛选列表
			goodsRankCol: [
				{
					title: '排名',
					key: 'rank'
				},
				{
					title: '商品名称',
					key: 'goodsName'
				},
				{
					title: '商品类别',
					key: 'goodsClass'
				},
				{
					title: '包间销售额',
					key: 'roomSales'
				},
				{
					title: '散座销售额',
					key: 'seatSales'
				},
				{
					title: '零售商品销售额',
					key: 'retailSales'
				},
				{
					title: '总销量',
					key: 'totalSalesNum',
					sortable: true
				},
				{
					title: '总销售额',
					key: 'totalSales',
					sortable: true,
					sortType: 'desc',
					sortMethod (a, b, type) {
						a = a.replace(/,/g, '');
						b = b.replace(/,/g, '');
						if (type === 'asc') {
							return Number(a) - Number(b);
						}
						return Number(b) - Number(a);
					}
				}
			],
			goodsRankData: [],
			classRankCol: [
				{
					title: '排名',
					key: 'rank'
				},
				{
					title: '商品类别',
					key: 'goodsClass'
				},
				{
					title: '包间销售额',
					key: 'roomSales'
				},
				{
					title: '散座销售额',
					key: 'seatSales'
				},
				{
					title: '零售商品销售额',
					key: 'retailSales'
				},
				{
					title: '总销量',
					key: 'totalSalesNum',
					sortable: true
				},
				{
					title: '总销售额',
					key: 'totalSales',
					sortable: true,
					sortType: 'desc',
					sortMethod (a, b, type) {
						a = a.replace(/,/g, '');
						b = b.replace(/,/g, '');
						if (type === 'asc') {
							return Number(a) - Number(b);
						}
						return Number(b) - Number(a);
					}
				}
			],
			classRankData: []
		};
	},
	computed: {
		goodsRankDataOfClassSelected () {
			let classId = parseInt(this.classValue);
			if (classId === 0) {
				return this.goodsRankData;
			}

			let className = this.classList.find(item => item.id === classId).name;

			return this.goodsRankData.filter(
				goods => goods.goodsClass === className
			);
		}
	},
	components: {
		StackedColumnChart
	},
	created () {
		this.getColumnDataAndInit();
		this.getTableDataAndInit();

		this.$request
			.post('/realtime/goods/cardData')
			.then(res => {
				if (res.errCode === '000000') {
					this.beginTime = res.result.beginTime;
					this.endTime = res.result.endTime;
					this.sales = res.result.sales;
					this.mealSales = res.result.mealSales;
					this.retailSales = res.result.retailSales;
				}
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		getColumnDataAndInit (params = { type: 0 }) {
			// 类别
			this.$request
				.post('/realtime/goods/goodsClassTop10', params)
				.then(res => {
					if (res.errCode === '000000') {
						const resData = res.result;
						let defaultClassTop10Option;

						this.classTop10Option.num = defaultClassTop10Option = {
							title: {
								text: '商品类别Top10'
							},
							legend: {
								data: resData.num.data.map(item => item.name)
							},
							yAxis: [{
								name: '数量'
							}],
							xAxis: [
								{
									name: '类别名',
									nameGap: 2,
									data: resData.num.xAxis
								}
							],
							series: resData.num.data.map(item => {
								item.barMaxWidth = '60px';
								return item;
							})
						};
						this.classTop10Option.sales = {
							title: {
								text: '商品类别Top10'
							},
							legend: {
								data: resData.sales.data.map(item => item.name)
							},
							yAxis: [{
								name: '数量'
							}],
							xAxis: [
								{
									name: '类别名',
									nameGap: 2,
									data: resData.sales.xAxis
								}
							],
							series: resData.sales.data.map(item => {
								item.barMaxWidth = '60px';
								return item;
							})
						};

						this.$refs.goodsClassTop10.init(defaultClassTop10Option);
					}
				})
				.catch(err => {
					console.log(err);
				});

			// 商品品种
			this.$request
				.post('/realtime/goods/goodsNameTop10', params)
				.then(res => {
					if (res.errCode === '000000') {
						const resData = res.result;
						let defaultNameTop10Option;

						this.nameTop10Option.num = defaultNameTop10Option = {
							title: {
								text: '商品品种Top10'
							},
							legend: {
								data: resData.num.data.map(item => item.name)
							},
							yAxis: [{
								name: '数量'
							}],
							xAxis: [
								{
									name: '商品名',
									nameGap: 2,
									data: resData.num.xAxis
								}
							],
							series: resData.num.data.map(item => {
								item.barMaxWidth = '60px';
								return item;
							})
						};
						this.nameTop10Option.sales = {
							title: {
								text: '商品品种Top10'
							},
							legend: {
								data: resData.sales.data.map(item => item.name)
							},
							yAxis: [{
								name: '数量'
							}],
							xAxis: [
								{
									name: '商品名',
									nameGap: 2,
									data: resData.sales.xAxis
								}
							],
							series: resData.sales.data.map(item => {
								item.barMaxWidth = '60px';
								return item;
							})
						};

						this.$refs.goodsNameTop10.init(defaultNameTop10Option);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getTableDataAndInit () {
			// 商品排行
			this.$request
				.post('/realtime/goods/goodsRank')
				.then(res => {
					if (res.errCode === '000000') {
						this.classList = res.result.goodsClass;
						this.goodsRankData = res.result.list.map(item => {
							// 后台忘记数据精度了。
							const { retailSales, roomSales, seatSales, totalSales, totalSalesNum, retailGoodsSales } = item;
							item.retailSales = formatPrice(retailSales);
							item.roomSales = formatPrice(roomSales);
							item.seatSales = formatPrice(seatSales);
							item.totalSales = formatPrice(totalSales);
							item.retailGoodsSales = formatPrice(retailGoodsSales);
							item.totalSalesNum = totalSalesNum;
							return item;
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
			// 类别排行
			this.$request
				.post('/realtime/goods/classRank')
				.then(res => {
					if (res.errCode === '000000') {
						this.classRankData = res.result.list.map(item => {
							// 后台忘记数据精度了。
							const { retailSales, roomSales, seatSales, totalSales, totalSalesNum, retailGoodsSales } = item;
							item.retailSales = formatPrice(retailSales);
							item.roomSales = formatPrice(roomSales);
							item.seatSales = formatPrice(seatSales);
							item.totalSales = formatPrice(totalSales);
							item.retailGoodsSales = formatPrice(retailGoodsSales);
							item.totalSalesNum = totalSalesNum;
							return item;
						}); ;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		chartClassChange (v) {
			this.$refs.goodsClassTop10.init(this.classTop10Option[v]);
		},
		chartNameChange (v) {
			this.$refs.goodsNameTop10.init(this.nameTop10Option[v]);
		},
		tableClassChange (v) {}
	}
};
</script>
