<style lang="less">


</style>

<template>
    <div id="print-area">
        <div class = "title">
            <h2>{{orderDetail.title}}</h2>
        </div>
        <div class="order-info">
            <div class="order-item">
                <span class="item-title">订单号：</span>
                <span class="item-content">{{orderDetail.orderId}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">开台时间：</span>
                <span class="item-content">{{orderDetail.startTime}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">开台员工：</span>
                <span class="item-content">{{orderDetail.startStaff}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">打单时间：</span>
                <span class="item-content">{{orderDetail.printTime}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">收银员工：</span>
                <span class="item-content">{{orderDetail.cashierStaff}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">房间类型：</span>
                <span class="item-content">{{orderDetail.teaTableType}}</span>
            </div>
            <div class="order-item">
                <span class="item-title">桌台/包间：</span>
                <span class="item-content">{{orderDetail.teaTableName}}</span>
            </div>
        </div>
        
        <div class="goods-info">
            <table style="width: 90%; text-align: center; border-bottom-style:dashed;  border-top-style:dashed" class="goods-table">
                <tr>
                    <th>消费名称</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                </tr>
                <tr v-for="(item,index) in orderDetail.consumerGoods" :key="index">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.count}}</td>
                    <td>{{item.totalPrice}}</td>
                </tr>
            </table>
        </div>
        <div class="pay-info">
            <div class="pay-item">
                <span class="item-title">消费金额：</span>
                <span class="item-content">{{orderDetail.totalPrice}}元</span>
            </div>
            <div class="pay-item">
                <span class="item-title">优惠金额：</span>
                <span class="item-content">{{orderDetail.disCountMoney}}元</span>
            </div>
                <div class="pay-item">
                <span class="item-title">优惠方式：</span>
                <span class="item-content">{{orderDetail.disCount}}折</span>
            </div>
                <div class="pay-item">
                <span class="item-title">商品数量：</span>
                <span class="item-content">{{orderDetail.totalGoodsNum}}</span>
            </div>
                <div class="pay-item">
                <span class="item-title">应收金额：</span>
                <span class="item-content">{{orderDetail.actualCollection}}元</span>
            </div>
                <div class="pay-item">
                <span class="item-title">收款金额：</span>
                <span class="item-content">{{orderDetail.receivedMoney}}元</span>
            </div>
            <div class="pay-item">
                <span class="item-title">找零金额：</span>
                <span class="item-content">{{orderDetail.returnMoney}}元</span>
            </div>
            <div class="pay-item">
                <span class="item-title">收款方式：</span>
                <span class="item-content">{{orderDetail.giveType}}</span>
            </div>
        </div>
        <div class="code-picture">
            <!-- <div class="bar-code">
                <img :src="barPath" class="bar-code-img">
            </div> -->
            <div class="qr-code">
                <div class="qr-code-left">
                    <img :src="logoPath" class="qr-code-img">
                </div>
                <div class="qr-code-right">
                    <img :src="invoicePath" class="qr-code-img">
                </div>
            </div>
        </div>
        <div class="hint">
            <div>*请保留结账账单，以作退换票凭证</div>
            <div>*如需开发票，扫描开发票二维码，填写开票信息</div>
        </div>
    </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import PrintPartial from '@/tools/print';

let printPartialObj = null;

export default {
	data () {
		return {
			orderDetail: {},
			barPath: '',
			logoPath: '',
			invoicePath: ''
		};
	},
	props: {
		orderId: {
			type: Number
		}
	},
	created () {
		this.init();
	},
	methods: {
		print () {
			// printPartial(document.getElementById('print-area'));
			printPartialObj.print();
		},
		init () {
			let postBody = {
				teaOrderId: this.orderId
			};
			let self = this;
			this.$http.request(this, 'POST', '/teaOrder/teaOrderReceiptPrint', postBody).then(res => {
				if (res.data.errCode === '000000') {
					let result = res.data.result;
					self.orderDetail = JSON.parse(JSON.stringify(result));
					self.barPath = 'http://www.gzqlwk.com:8080/' + result.barPath;
					self.logoPath = 'http://www.gzqlwk.com:8080/' + result.logoPath;
					self.invoicePath = 'http://www.gzqlwk.com:8080/' + result.invoicePath;

					// dom 更新完毕再启动
					this.$nextTick(() => {
						printPartialObj = new PrintPartial(document.getElementById('print-area'));
					});
				}
			}).catch(error => {
				console.log(error);
			});
		}
	}
};
</script>
