<style>
@media print {
		html, body, #main, .main {
		height: auto;
	}
}
</style>
<style lang="less" scoped>

@page {
	margin: 0;
	size: auto;
	// font-size: 3em;
	// page-break-before: always;
}

.receipt-wrapper {
	//   position: fixed;
	//   left: 0;
	//   top: 0;
	//   width: 100%;
	//   height: 100%;
	//   z-index: 101;
	background-color: #fff;
	// width: 800px;
	// margin: 0 auto;
}
#print-area {
	// width: 100%;
	width: 200px;
	// margin: 0 auto;
	padding: 0 10px;
	font-size: 12px;
	font-family: "Microsoft YaHei";
}
.order-info,
.goods-info,
.pay-info {
//   margin: 16px 0;
  background-color: #fff;
}

.order-item, .pay-item {
	display: flex;
	justify-content: space-betweena;
	.item-title {
		white-space: nowrap;
	}
	.item-content {
	  margin-right: 30px;
	  text-align: center;
	  word-break: break-all;
  }
}

.title {
  text-align: center;
}
.hint {
  margin: 16px 0;
  color: gray;
  font-size: 12px;
  page-break-after: always;
}

// .bar-code {
//   text-align: center;
// }
// .bar-code-img {
//   width: 50%;
//   height: 2%;
// }

// .qr-code {
//   width: 260px;
//   padding: 0 4px;

//   &::after {
//     content: "";
//     display: block;
//     clear: both;
//   }
// }
// .qr-code-left,
// .qr-code-right {
//   //   flex: 1;
//   float: left;
//   width: 50%;
//   text-align: center;
//   box-sizing: border-box;
// }
// .qr-code-img {
//   display: block;
//   width: 100%;
// }

// .qr-code-right {
//   padding: 20px;
//   margin-top: -20px;
// }
</style>
<!-- 门店包间散座小票 -->
<template>
<div>
	<div class="title">
		<h2>{{ orderDetail.title}}</h2>
	</div>
	<div class="order-info">
		<div class="order-item">
			<span class="item-title">订 单 号：{{ orderDetail.orderId }}</span>
		</div>
		<div class="order-item">
			<span class="item-title">开台时间：{{ orderDetail.orderTime }}</span>
		</div>
		<div class="order-item">
			<span class="item-title">开台员工：{{ orderDetail.staff }}</span>
		</div>
		<div class="order-item">
			<span class="item-title">房间类型：{{ orderDetail.name }}</span>
		</div>
	</div>

	<div class="goods-info">
		<table
			style="width: 100%; text-align: center; border-bottom-style:dashed;  border-top-style:dashed"
			class="goods-table"
		>
			<tr>
				<th>消费名称</th>
				<th>数量</th>
				<th>单价</th>
				<th>金额</th>
			<tr v-for="(item,index) in goodsList" :key="index">
				<td style="width: 35%;">{{ item.goodName }}</td>
				<td style="width: 15%;">{{ item.goodCode }}</td>
				<td style="width: 25%;">{{ item.unitPrice }}</td>
				<td style="width: 25%;">{{ item.totalPrice }}</td>
			</tr>
		</table>
	</div>
	<div class="pay-info">
		<div class="pay-item">
			<div class="item-title">消费金额：</div>
			<div class="item-content">{{ getGoodsSum }}元</div>
		</div>
		<div class="pay-item">
			<span class="item-title">商品数量：</span>
			<span class="item-content">{{ getGoodsNum }}</span>
		</div>
		<div class="pay-item">
			<span class="item-title">收款金额：</span>
			<span class="item-content">{{ getGoodsSum }}元</span>
		</div>
		<div class="pay-item">
			<span class="item-title">找零金额：</span>
			<span class="item-content">0 元</span>
		</div>
		<div class="pay-item">
			<span class="item-title">收款方式：</span>
			<span class="item-content">{{ orderDetail.payway }}</span>
		</div>
	</div>
	<div class="hint">
		<div>*请保留结账账单，以作退换票凭证</div>
		<!-- <div>*如需开发票，扫描开发票二维码，填写开票信息</div> -->
	</div>
</div>
</template>

<script>
import { formatPrice } from '@/tools';
import { PRINT_BASE_URL } from '@/config';
import { getPrintData } from '@/tools/storage/print';

export default {
	name: 'orderReceiptPrint',
	filters: {
		formatPrice (price) {
			return formatPrice(price);
		}
	},
	data () {
		return {
			getGoodsNum: 0,
			getGoodsSum: 0,
			goodsList: [],
			orderDetail: {},
			barPath: '',
			logoPath: '',
			invoicePath: '',
			ifShow: true,
			canUse: true,

			isGoodsSell: false,
			goodsSellDetail: {
				goodsList: []
			}
		};
	},
	// watch: {
	// 	getGoodsNum () {
	// 		return this.goodsList.map(x => x.goodCode).reduce((a, b) => {
	// 			return a + parseInt(b);
	// 		}, 0);
	// 	},
	// 	getGoodsSum () {
	// 		// return this.priceObj.totalPrice;
	// 		return this.goodsList.map(x => x.unitPrice * x.goodCode).reduce((a, b) => {
	// 			return a + parseInt(b);
	// 		}, 0);
	// 	}
	// },
	created () {
		const id = Number(this.$route.query.id);
		this.start(id);
	},
	methods: {
		start (id) {
			let postBody = {
				teaOrderId: id
			};
			this.$http.request(this, 'POST', '/teaOrder/getQueryOrder', {orderId: postBody.teaOrderId})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.goodsList = JSON.parse(res.data.data.queryOrder[0].goods);
						this.goodsList.forEach(item => {
							item.totalPrice = item.goodCode * item.unitPrice;
						});
						this.getGoodsNum = this.goodsList.map(x => x.goodCode).reduce((a, b) => {
							return a + parseInt(b);
						});
						this.getGoodsSum = this.goodsList.map(x => x.unitPrice * x.goodCode).reduce((a, b) => {
							return a + parseInt(b);
						});
						this.orderDetail = res.data.data.queryOrder[0];
						console.log('orderDetail', this.orderDetail);
						// dom 更新完毕再启动
						this.$nextTick(() => {
							window.print();
							setTimeout(() => {
								window.close();
							}, 0);
							// this.ifShow = false;
						});
					} else {
						this.$nextTick(() => {
							// window.print();
							this.ifShow = false;
							this.$Message.error('数据请求出错');
						});
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>
