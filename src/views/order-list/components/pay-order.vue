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
                        <div>支付方式：    
							<Select v-model="payway" style="width:200px">
        						<Option v-for="item in payList" :value="item" :key="item">{{ item }}</Option>
    						</Select>
						</div>
						 <i-button type="primary" @click="payOrder">结账</i-button>
                        <!-- <div class="btn-group">
                            <i-button type="primary" @click="printTicket">打印小票</i-button>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

		<!-- 增加商品 menu modal -->
        <i-modal
            v-model="ifShowMenu"
            :width="1024"
            ok-text="下单"
            title="商品售出"
            :loading="ifLoaing"
            @on-cancel="menuCancel"
            @on-ok="sell">

            <Menu ref="menu" :isWithState="true" />
        </i-modal>
		<!-- 支付modal -->
        <i-modal
            v-model="ifShowPay"
            ok-text="结账"
            title="结账单"
            :styles="{top: '20px'}"
            :loading="ifLoaing"
            @on-ok="payProxy">
            <i-card>
                <p slot="title">商品明细</p>
                <i-table :columns="gslPayCol" :data="goodsList" :height="200"></i-table>
            </i-card>
            <br>
            <i-card>
                <p slot="title">支付方式</p>
                <i-row class="pay-way">
                    <i-col span="8">
                        <div class="pay-type-item" @click="changePayIndex(PAY_TYPE.rmb)">
                            <div :class="[currentPayType === PAY_TYPE.rmb ? 'icon-pay-rmb-on' : 'icon-pay-rmb']"></div>
                            <p>现金支付</p>
                        </div>
                    </i-col>
                    <i-col span="8">
                        <div class="pay-type-item" @click="changePayIndex(PAY_TYPE.wechat)">
                            <div :class="[currentPayType === PAY_TYPE.wechat ? 'icon-pay-wechat-on' : 'icon-pay-wechat']">
                            </div>
                            <p>微信支付</p>
                        </div>
                    </i-col>
                    <i-col span="8">
                        <div class="pay-type-item" @click="changePayIndex(PAY_TYPE.alipay)">
                            <div :class="[currentPayType === PAY_TYPE.alipay ? 'icon-pay-alipay-on' : 'icon-pay-alipay']">
                            </div>
                            <p>支付宝</p>
                        </div>
                    </i-col>
                    <!-- <i-col span="6">
                        <div class="pay-type-item" @click="changePayIndex(PAY_TYPE.card)">
                            <div :class="[currentPayType === PAY_TYPE.card ? 'icon-pay-vip-on' : 'icon-pay-vip']">
                            </div>
                            <p>会员卡</p>
                        </div>
                    </i-col> -->
					<p class="notice-msg" v-show="ifShowNotice">{{ noticeMsg }}</p>
                </i-row>
                <p class="sum-should-pay">应付金额：￥ {{ getGoodsSum }}</p>
            </i-card>
        </i-modal>

        <i-modal
            title="退回商品"
            v-model="ifShowGoodsBack"
            @on-ok="setGoodsBack">
            <i-form label-position="left" :label-width="100">
                <i-form-item label="退回的数量：">
                    <i-input-number v-model="goodsBackCount" :precision="0" :max="goodsBackObj.num" :min="0" size="large" @on-keypress.enter="setGoodsBack"></i-input-number>
                </i-form-item>
            </i-form>
			<div slot="footer">
				<Button type="text" @click="ifShowGoodsBack = false">取消</Button>
                <Button type="primary" @click="setGoodsBack">确定</Button>
			</div>
        </i-modal>

		<!-- <print ref="print"/> -->

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
			room: [],
			payway: '',
			payList: ['现金支付', '微信支付', '支付宝支付'],
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
			roomName: '',
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
		payOrder () {
			this.$http.request(this, 'POST', '/teaTable/setAccount', {orderId: this.id, payway: this.payway, payment: this.getGoodsSum, roomId: this.room.roomId, tableId: this.room.tableId, reserveTime: this.room.reserveTime})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('结账成功!');
						this.$router.push('/order/order');
					}
				});
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
			this.$router.push({path: '/order/order', query: { cached: 'y' }});
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
		this.roomName = this.$route.query.roomName;
		this.room = this.$store.state.room;
		console.log('room', this.room);
		if (this.room.name.indexOf('包间') !== -1 || this.roomName.indexOf('包间') !== -1) {
			this.room.roomId = this.room.id;
			this.room.tableId = null;
		} else {
			this.room.tableId = this.room.id;
			this.room.roomId = null;
		}
		console.log('this.room', this.room);
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
		next();
	}
};
</script>

