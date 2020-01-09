<style lang="less" scoped>
#goods-report {
	min-width: 1024px;
	background-color: #e4e4e2;
	border-radius: 15px;
	.top-area {
		border-bottom: 1px solid #d8d8d6;
		padding: 15px;
		// font-size: 20px;
		color: #7b7256;
	}
	.bottom-area {
		padding: 15px;
	}
}

.radios-wrapper {
	text-align: center;
	padding: 20px;
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

</style>

<template>
	<is-sit-version v-if="!canUse"/>

	<div v-else id="goods-report">
		<div class="bottom-area">
				<!-- <i-tag color="blue">商品报表</i-tag> -->
			<i-tabs type="card">
				<i-tab-pane label="商品销售报表" class="padding-left-10">
					<div class="margin-top-8">
						<i-button style="float: right; margin-right: 10px;" type="primary" @click="exportExcel(goodsRankCol, goods, '商品销售报表')">导出EXCEL</i-button>
						<span style="font-size: 16px; font-weight: bold;">商品类别</span>
						<i-select style="width: 200px" class="margin-left-10" v-model="classValue">
							<i-option value="0">全部</i-option>
							<i-option v-for="(l, i) in classList" :key="i" :value="l.id">{{ l.name }}</i-option>
						</i-select>
					</div>

					<i-table
						border
						height="400"
						:columns="goodsRankCol"
						:data="goods"
						class="margin-top-8"
						id="goodsRank"
					/>
				</i-tab-pane>
			</i-tabs>
		</div>

	</div>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';
import StackedColumnChart from '../components/chart-stacked-column';
import { exportTableToExcell } from '@/libs/tableToExcel';
import { resetTableHeight, formatPrice } from '@/tools';
import Mixins from '../mixins';

export default {
	name: 'goods-report',
	mixins: [Mixins],
	data () {
		return {
			goods: [],
			daterange: [],
			sales: 0,
			mealSales: 0,
			retailSales: 0,

			classRadio: 'num',
			categoryRadio: 'num',
			classTop10Option: {
				num: {},
				sales: {}
			},
			nameTop10Option: {
				num: {},
				sales: {}
			},

			classValue: '0',
			classList: [],
			goodsRankCol: [
				{
					title: '排名',
					key: 'rank'
				}, {
					title: '商品名称',
					key: 'goodsName'
				}, {
					title: '商品类别',
					key: 'goodsClass'
				}, {
					title: '总销量',
					key: 'totalSalesNum',
					sortable: true
				}, {
					title: '总销售额',
					key: 'totalSales',
					sortable: true,
					width: 120
					// sortType: 'desc'
				}
			],
			classRankCol: [
				{
					title: '排名',
					key: 'rank'
				}, {
					title: '商品类别',
					key: 'goodsClass'
				}, {
					title: '总销量',
					key: 'totalSalesNum',
					sortable: true
				}, {
					title: '总销售额',
					key: 'totalSales',
					sortable: true,
					width: 120
					// sortType: 'desc'
				}
			],
			goodsRankData: [],
			classRankData: []
		};
	},
	components: {
		IsSitVersion,
		StackedColumnChart
	},
	methods: {
		search () {
			// this.getCardData();
			this.getTableDataAndInit();
			// this.getColumnDataAndInit();
		},
		getCardData () {
			this.$request.post('/goods/cardData', this.requestTimestamp)
				.then(res => {
					if (res.errCode === '000000') {
						this.sales = res.result.sales;
						this.mealSales = res.result.mealSales;
						this.retailSales = res.result.retailSales;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getTableDataAndInit () {
			// 商品排行
			this.$http.request(this, 'POST', '/teaOrder/getTeaOrderList')
				.then(res => {
					if (res.data.errCode === '000000') {
						// const RESULT = res.data.result;
						// this.totalPages = RESULT.total;
						let arr = [];
						res.data.data.orderList.forEach(item => {
							if (item.state === '0') {
								console.log('1');
								arr.push(JSON.parse(item.goods));
							}
						});
						let goodsName = [];
						console.log('arr', arr);
						arr.forEach(item => {
							item.forEach(itm => {
								if (!goodsName.includes(itm.goodName)) {
									goodsName.push(itm.goodName);
								}
							});
						});
						goodsName.forEach(item => {
							this.goods.push({goodsName: item, totalSalesNum: 0, totalSales: 0});
						});
						arr.forEach(item => {
							item.forEach(itm => {
								this.goods.forEach(i => {
									console.log('itm.goodsName', itm.goodName);
									if (i.goodsName === itm.goodName) {
										i.totalSalesNum = i.totalSalesNum + parseInt(itm.goodCode);
										i.totalSales = i.totalSales + parseInt(itm.unitPrice) * parseInt(itm.goodCode);
										i.goodsClass = itm.goodCategory;
									}
								});
							});
						});
						for (let i = 0; i < this.goods.length - 1; i++) {
							for (let j = 0; j < this.goods.length - 1 - i; j++) {
								if (this.goods[j + 1].totalSalesNum > this.goods[j].totalSalesNum) {
									let temp = JSON.parse(JSON.stringify(this.goods[j]));
									this.goods[j] = JSON.parse(JSON.stringify(this.goods[j + 1]));
									this.goods[j + 1] = JSON.parse(JSON.stringify(temp));
								}
							}
						}
						this.goods.forEach((item, index) => {
							item.rank = index + 1;
						});
						console.log('goods', this.goods);
					}
				})
				.catch(e => {
					console.log(e);
					this.isTableLoading = false;
				});
		},
		exportExcel (col, data, title = '') {
			const params = {
				title: col.map(item => item.title),
				key: col.map(item => item.key),
				data: data,
				autoWidth: true,
				filename: title
			};
			exportTableToExcell(params);
		}
	}
};
</script>
