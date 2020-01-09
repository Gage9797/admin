
<style lang="less" scoped>
    .ordersDetail{
        width: 99%;
        height: 285px;
        background: #eaeaea;
        .detailMeaasge{
            position: relative;
            height: 98px;
            width: 96%;
            margin-left: 2%;
            font-size: 14px;
            line-height: 23px;
            letter-spacing: 2px;
            color: #555453;
            border-bottom: 1px solid #dcdcdc;
            .orderNumber{
                position: relative;
                top: 22px;
                padding-bottom: 18px;
            }
            .createTime{
                position: relative;
                margin-top: 18px;
            }
        }
        .detailTable{
            width: 85%;
            margin: 0 auto;
            .order-table {
                width: 100%;
                margin: 0 auto;
                border-color: #eaeaea;
            }
            /deep/ .ivu-table{
                &:after{
                    width: 1px;
                    background: #eaeaea;
                    color: #eaeaea;
                }
            }
        }
        .printOrder{
            position: absolute;
            bottom: 20px;
            right: 100px;
        }
    }
    /deep/ .ivu-table td{
    background: rgb(235,235,233);
    border-bottom: 1px solid rgb(210,210,210)
    }
    /deep/ .ivu-table th{
        background: rgb(235,235,233);
        border-bottom: 1px solid rgb(210,210,210);
        color: rgb(107,92,67)
    }
</style>

<template>
    <div class="ordersDetail">
        <div class="detailMeaasge">
            <div class="orderNumber">订单编号：{{ orderId }}</div>
            <div class="createTime">下单时间：{{ createTimeStr }}</div>
        </div>
        <div class="detailTable">
            <Table border :columns="columns" :data="OrderGoods" class="order-table"></Table>
        </div>
        <i-button class="printOrder" type="primary" @click="printOrder">打印订单</i-button>
    </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import print from '@/tools/print';

let getStateStr = (state) => {
	let str = '';

	if (state === 1) {
		str = '未付款';
	} else if (state === 2) {
		str = '待发货';
	} else if (state === 3) {
		str = '已发货';
	} else if (state === 4 || state === 5) {
		str = '已完成';
	} else if (state === 6) {
		str = '退款/售后';
	} else if (state === 7) {
		str = '已关闭';
	}
	return str;
};
export default {
	props: {
		OrderGoods: {
			type: Array,
			required: true
		},
		createTime: {
			type: Number,
			default: ''
		},
		orderId: {
			type: String,
			default: ''
		},
		userInfo: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			columns: [{
				title: '商品名称',
				key: 'goodsName',
				align: 'center'
			}, {
				title: '订单编号',
				align: 'center',
				key: 'orderId'
			}, {
				title: '商品数量',
				align: 'center',
				key: 'count'
			}, {
				title: '订单状态',
				align: 'center',
				render: (h, params) => {
					return h('div', getStateStr(parseInt(params.row.state)));
				}
			}, {
				title: '订单运费',
				align: 'center',
				key: 'deliveryPrice'
			}, {
				title: '订单总价',
				align: 'center',
				key: 'totalPrice'
			}]
		};
	},
	methods: {
		// 打印
		printOrder () {
			const { OrderGoods, createTimeStr, userInfo } = this;
			const { count, orderId, totalPrice } = OrderGoods[0];

			const printData = {
				orderNo: orderId,
				createTime: createTimeStr,
				buyerInfo: userInfo,
				printTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date()),
				goodsCount: count,
				receivedMoney: totalPrice,
				paymentType: '微信支付' // 快递订单
			};

			this.$http
				.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/printTickets', {
					orderId: Number(this.$route.query.id)
				})
				.then(res => {
					if (res.data.errCode === '000000') {
						printData.goodsList = res.data.result.teaShoppingOrderGoods;
						print(printData);
					} else {
						this.$Message.error(`[${res.data.errCode}]: ${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	computed: {
		createTimeStr () {
			return dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(this.createTime));
			// return new Date(this.createTime);
		}
	}

};
</script>
