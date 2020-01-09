<style lang="less" scoped>
@import '~@/styles/icon-pay.less';
// @import './icon-pay.less';

.order-info, .goods-info {
    margin: 16px 0;
    padding: 16px;
    background-color: #fff;
}
.goods-info-sum {
    position: relative;
    margin-top: 10px;
    line-height: 24px;

    .btn-group {
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
.pay-type-item {
    width: 100px;
    text-align: center;
	overflow: hidden;
	margin: 0 auto;

    div {
        width: 100px;
		height: 80px;
        font-size: 80px;

        &:hover {
            cursor: pointer;
        }
    }
    p {
        margin-top: 10px;
    }
}
.sum-should-pay {
    margin-top: 30px;
    color: #1c2438;
    font-weight: 700;
}

.pay-way {
	position: relative;

	.notice-msg {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
		font-size: 18px;
		text-align: center;
		color: #cc5137;
	}
}

.ivu-form-item {
    margin-bottom: 0;
}
</style>

<template>
    <div id="order_detail">
        <div>
            <i-button type="primary" icon="ios-arrow-back" @click="goBack">返回列表</i-button>
        </div>
        <div class="order-info">
            <i-form v-model="orderForm" label-position="left">
                    <i-form-item v-for="(info, index) in orderForm" :key="index" :label="info.label">
                        <span>{{ info.value }}</span>
                    </i-form-item>
            </i-form>
        </div>
		<!-- 订单商品信息 -->
        <div class="goods-info">
            <i-table :columns="glColums" :data="goodsList" :height="400"></i-table>
            <div class="goods-info-sum">
                <div v-if="!isOrderFinished">
                    <div>商品数量：<span>{{ getGoodsNum }}</span></div>
                    <div>
                        <div>应付金额：￥ {{ getGoodsSum | formatPrice }} 元</div>
                        <div class="btn-group">
                            <i-button style="margin-right: 40px" @click="addHandler">增加</i-button>
                            <i-button type="primary" @click="openPayModal">结账</i-button>
                        </div>
                    </div>
                </div>
                <div v-if="isOrderFinished">
                    <div>商品数量：<span>{{ getGoodsNum }}</span></div>
                    <div>实收金额：<span>￥ {{ getGoodsSum | formatPrice }}  元</span></div>
                    <div>
                        <div>收款方式：<span>{{ payway }}</span></div>
                        <div class="btn-group">
                            <i-button type="primary" @click="printTicket">打印小票</i-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 支付方式的具体实现 -->
        <all-the-pay ref="allThePay" :priceObj="priceObj" @payHandler="payHandler"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dateTools from '@/tools/dateTools';
import { formatPrice } from '@/tools';
import Menu from '@/components/menu';
// import Print from './print';
import AllThePay from './all-the-pay';

const PAY_TYPE = {
	rmb: 1,
	wechat: 2,
	alipay: 3,
	card: 4
};

export default {
	filters: {
		formatPrice (price) {
			return formatPrice(price);
		}
	},
	components: {
		// Print,
		AllThePay,
		Menu
	},
	data () {
		return {
			payway: '',
			canUse: true,
			ifShowNotice: false,
			noticeMsg: '',
			id: this.$route.query.orderId,
			isOrderFinished: true,
			orderForm: [],
			glColums: [
				{
					title: '商品名称',
					align: 'center',
					key: 'goodName'
				}, {
					title: '数量',
					align: 'center',
					key: 'goodCode'
				}, {
					title: '单价',
					align: 'center',
					key: 'unitPrice'
				}, {
					title: '总价',
					align: 'center',
					key: 'totalPrice'
				}, {
					title: '操作',
					align: 'center',
					width: 100,
					key: 'action',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled: this.isOrderFinished
								},
								on: {
									click: () => {
										this.goodsBackObj = params.row;
										this.ifShowGoodsBack = true;
									}
								}
							},
							'退回商品')
						]);
					}
				}
			],
			gslPayCol: [
				{
					title: '商品名称',
					align: 'center',
					key: 'goodsName'
				}, {
					title: '数量',
					align: 'center',
					key: 'num'
				}, {
					title: '单价',
					align: 'center',
					key: 'price'
				}, {
					title: '总价',
					align: 'center',
					width: 80,
					key: 'sum',
					render: (h, params) => {
						return h('div', (params.row.num * params.row.price).toFixed(2));
					}
				}
			],
			gslPayData: [],
			goodsList: [],
			ifShowMenu: false,
			ifShowPay: false,
			ifLoaing: true,
			ifShowGoodsBack: false,
			currentPayType: 1,
			goodsBackCount: 0,
			goodsBackObj: {
				num: 0
			},

			priceObj: {
				payWay: '-'
			},
			totalPrice: 0
		};
	},
	computed: {
		getGoodsNum () {
			return this.goodsList.map(x => x.goodCode).reduce((a, b) => {
				return a + parseInt(b);
			}, 0);
		},
		getGoodsSum () {
			// return this.priceObj.totalPrice;
			return this.goodsList.map(x => x.totalPrice).reduce((a, b) => {
				return a + parseInt(b);
			}, 0);
		},
		PAY_TYPE () {
			return PAY_TYPE;
		},
		...mapGetters(['wxPayState', 'aliPayState'])
	},

	methods: {
		init () {
			this.$http.request(this, 'POST', '/teaOrder/getQueryOrder', {orderId: this.id})
				.then(res => {
					if (res.data.errCode === '000000') {
						// const { goodsList, detailTitle } = res.data.result;
						this.goodsList = JSON.parse(res.data.data.queryOrder[0].goods);
						console.log('this.goodsList', this.goodsList);
						// this.totalPrice = detailTitle.totalPrice;
						// this.initForm(detailTitle);
					}
				})
				.catch(err => {
					console.log(err);
				});

			// this.getOrderTotalPay();
		},
		initForm (row) {
			let type = typeof row.roomId === 'undefined' ? '散座 - ' : '包间 - ';

			const state = Number(row.state);	// 消费状态
			let stateStr = '已完成';
			let disSec = 0;

			if (state === 1 || state === 4) {
				this.isOrderFinished = false;
				stateStr = '消费中';
				disSec = parseInt(row.lastTime / 1000); // 消费时长
			} else {
				this.isOrderFinished = true;
				disSec = parseInt((row.endTime - Number(row.orderTime)) / 1000); // 消费时长
			}
			const H = parseInt(disSec / 3600);
			const M = Math.floor((disSec % 3600) / 60);

			this.orderForm = [
				{
					label: '订单编号：',
					value: row.orderNo || this.$route.query.orderNo
				}, {
					label: '订单时间：',
					value: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(row.orderTime))
				}, {
					label: '桌台类型：',
					value: type + row.name
				}, {
					label: '消费时长：',
					value: `${H} 小时 ${M} 分钟`
				}, {
					label: '消费状态：',
					value: stateStr
				}, {
					label: '包间人数：',
					value: row.peopleNum
				}
			];
		},
		getOrderTotalPay () {
			this.$http.request(this, 'POST', '/teaOrder/getOrderTotalPay', {teaOrderId: this.id})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.priceObj = res.data.result;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		goBack () {
			this.$router.push({path: '/business/order', query: { cached: 'y' }});
		},
		addHandler () {
			this.ifShowMenu = true;
		},
		sell () {
			const GSL = this.$store.getters.gslSelectedList;
			if (GSL.length === 0) {
				this.ifShowMenu = false;
				this.$Message.error('请先选择商品');
				return;
			}
			let gsSelected = GSL.map(x => {
				return {
					goodsId: x.id,
					count: x.count
				};
			});
			this.$http
				.request(this, 'POST', '/teaTable/addTableGoods', {
					teaHouseId: this.teaHouseId,
					teaOrderId: this.id,
					teaTableGoods: gsSelected
				})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.ifShowMenu = false;
						this.init();
						this.$refs.menu.getGslAlt();
						this.$store.commit('clearGslSelected');
						this.$Message.success('成功添加商品！');
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		menuCancel () {
			this.$store.commit('clearGslSelected');
			this.$refs.menu.getGslAlt();
		},
		openPayModal () {
			this.ifShowPay = true;
		},
		changePayIndex (index) {
			if (index === PAY_TYPE.wechat && this.wxPayState < 2) {
				this.noticeMsg = `暂时未开通微信支付，${this.wxPayState === 0 ? '若需开通请联系客服' : '请耐心等待审核结果'}。`;
				this.ifShowNotice = true;
			}
			if (index === PAY_TYPE.alipay && this.aliPayState < 2) {
				this.noticeMsg = `暂时未开通支付宝支付，${this.aliPayState === 0 ? '若需开通请联系客服' : '请耐心等待审核结果'}。`;
				this.ifShowNotice = true;
			}

			if (this.ifShowNotice) {
				setTimeout(() => {
					this.ifShowNotice = false;
				}, 3000);
				return false;
			}

			this.currentPayType = index;
		},
		payProxy () {
			switch (this.currentPayType) {
				case PAY_TYPE.rmb:
					this.payByRMB();
					break;
				case PAY_TYPE.wechat:
					this.$refs.allThePay.payByWechat();
					break;
				case PAY_TYPE.alipay:
					this.$refs.allThePay.payByAlipay();
					break;
				case PAY_TYPE.card:
					this.$refs.allThePay.payByCard();
					break;
				default:
					break;
			}
			this.ifShowPay = false;
		},
		payByRMB () {
			this.$Modal.confirm({
				title: '结账确认',
				loading: true,
				content: '确认金额 ' + this.getGoodsSum + ' ?',
				onOk: () => {
					this.payHandler();
					this.$Modal.remove();
				}
			});
		},
		payHandler (payCode = '', cb) {
			let postData = {
				teaOrderId: parseInt(this.id),
				orderPrice: this.getGoodsSum,
				payWay: this.currentPayType,
				payCode: payCode
			};
			this.$http.request(this, 'POST', '/teaOrder/payForOrder', postData)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('支付成功！');
						this.init();
						// this.$refs.printArea.init();
						cb && cb();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		printTicket () {
			// this.$refs.print.start(this.id);
			// const { host, pathname } = location;
			const url = location.href.split('#/')[0] + '#/print?id=' + this.id;
			const win = window.open(url, 'printwindow', 'resizable');
		},
		setGoodsBack () {
			if (this.goodsBackCount > 0) {
				const postData = {
					orderId: this.id,
					id: this.goodsBackObj.id,
					goodsId: this.goodsBackObj.goodId,
					count: this.goodsBackCount
				};
				this.$http.request(this, 'POST', '/teaOrder/reduceGoods', postData)
					.then(res => {
						this.ifShowGoodsBack = false;
						if (res.data.errCode === '000000') {
							this.$Message.success('退回成功！');
							this.goodsBackCount = 0;
							this.$refs['menu'].getGslAlt();	// 退回商品后需要刷新菜单中的数据
							this.init();
						} else {
							this.$Message.error(`[${res.data.errCode}]: ${res.data.errMsg}`);
						}
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this.$Message.error('退回商品数不可少于1');
			}
		}
	},
	created () {
		this.init();
		this.payway = this.$route.query.payway;
		console.log('pa', this.payway);
		// this.$store
		// 	.dispatch('GetAppInfo')
		// 	.then(({ appVersion, restTime }) => {
		// 		this.canUse = (appVersion === 3 && restTime >= 0);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	},
	beforeRouteUpdate (to, from, next) {
		this.id = to.query.orderId;
		this.payway = to.query.payway;
		next();
	}
};
</script>

