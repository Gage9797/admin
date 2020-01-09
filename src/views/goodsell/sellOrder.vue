<style lang="less" scoped>
@import "~@/styles/icon-pay.less";
  .shopping-order{
    background: rgb(228,228,226);
    border-radius: 16px;
	position: relative;
	padding: 20px;
  }
  .select-wrap{
    border-bottom: 1px solid rgb(210,210,210);
    padding-top: 10px;
    padding-left: 10px;
    margin-top: 0;
  }
  .ctrl-bar {
	  position: relative;
	  main {
		  position: relative;
	  }
	.page {
		position: relative;
		margin-top:10px;
		text-align: center;
		.goodsell-btn{
			position: absolute;
			bottom: 0px;
			right: 20px;
		}
	}
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
.pay-type-item {
  width: 100px;
  text-align: center;
  margin: 0 auto;
  overflow: hidden;

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
  .modal-p {
	text-indent: 4px;
	line-height: 2;
	margin: 10px 0;
	}
	/deep/ .ivu-spin-fix {
		display: block;
	}
  /deep/ .ivu-input{
    background:rgb(235,235,233);
    display: inline-block;
  }
  /deep/ .ivu-select-selection{
    background:rgb(235,235,233);
  }
  /deep/ .ivu-form-item-label{
    color: rgb(95,95,95);
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
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
//   .lookTable{
// 	  height: 90px !important;
// 	  border: none;
// 	  border-radius: 20px;
// 	  /deep/ .ivu-table{
// 		  border: 1px solid rgb(210,210,210);
// 		  border-radius: 10px !important;
// 		  &:after{
// 			  width: 0;
// 			  height: 0;
// 		  }
// 		  &:before{
// 			  width: 0;
// 			  height: 0;
// 		  }
// 		}
// 		 /deep/ .ivu-table td{
// 			background: #fff;
// 			border: none;
// 		}
// 		/deep/ .ivu-table th{
// 			background: #fff;
// 			border-bottom: 1px solid rgb(210,210,210);
// 		}
//   }
.operation-staff {
	font-size: 12px;
	display: inline-block;
	line-height: 30px;
	color: #1c2438;
	font-weight: 700;
}
  .table{
    margin: 20px 0;
  }
	.spin-icon-load{
		animation: ani-spin 1s linear infinite;
	}
</style>

<template>
    <div class="shopping-order">
		<div class="ctrl-bar">
			<main>
				<div class="select-wrap">
					<Form>
						<i-row>
							<i-col span="9">
								<FormItem label="售 出 时 段 ">
									<DatePicker type="daterange" placement="bottom-start" placeholder="请选择" style="width: 70%; margin-left: 10px" v-model="daterange" :editable="false"></DatePicker>
								</FormItem>
							</i-col>
							<i-col span="9">
								<FormItem label="状 态 ">
									<Select class="good-state" v-model="listQueryOption.state" style="width: 70%; margin-left: 10px">
										<Option v-for="item in statusName" :value="item.value" :key="item.index" >{{ item.label }}</Option>
									</Select>
								</FormItem>
							</i-col>
							<i-col span="2">
								<Button type="primary" @click="query" style="margin-left: 10px;">查询</Button>
							</i-col>
						</i-row>
					</Form>
				</div>
				<div class="table-wrapper">
					<Table border :columns="goodsellOrder" :data="goodsellOrderList" class="table"></Table>
					<Spin fix v-show="isTableLoading">
						<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
						<div>Loading</div>
					</Spin>
				</div>
			</main>
			<div class="page">
				<Page :total="totalPages" show-elevator @on-change="pageChange"></Page>
				<Button type="primary" class="goodsell-btn" @click="ifShowMenu = true">商品售出</Button>
			</div>
		</div>
		    <!-- 查看 -->
		<i-modal v-model="ifShowDetail" title="售出详情">
			<p class="modal-p">订 单 号：{{ detailData.orderId }}</p>
			<p class="modal-p">开单时间：{{ detailData.createTime }}</p>

			<i-table :columns="orderDetailCol" :data="detailData.orderDetailData" :height="200"></i-table>

			<p class="modal-p">商品数量：{{ detailData.totalCount }}</p>
			<p class="modal-p">收费方式：{{ detailData.payWay | payWayFilters }}</p>
			<p class="modal-p">实收金额：￥ {{ detailData.totalPrice | totalprice }}</p>
			<!-- 重写底部按钮 -->
			<footer slot="footer">
				<Button type="primary" class="goodsell-btn" @click="confirmedOrPrint(detailData)">{{btnText}}</Button>
			</footer>
		</i-modal>
		<!-- 商品售出 -->
		<!-- 菜单 -->
		<i-modal width="1024" v-model="ifShowMenu" ok-text="下单" :loading="isLoading" title="商品售出" @on-visible-change="sentBcakGsl">
			<Menu />
			<div slot="footer" style="text-align:center">
				<Button @click="addCancel" type="text" size="large">取消</Button>
				<Button @click="handleSubmit" class="modal-confirm" type="primary" size="large">确定</Button>
			</div>
		</i-modal>

		<!-- 支付相关 -->
		<i-modal v-model="ifShowPay" ok-text="结账" title="结账单" :loading="ifLoaing" @on-ok="pay" @on-cancel="cancelPay">
			<i-card>
				<p slot="title">商品明细</p>
				<i-table :columns="gslPayCol" :data="gslSelectedList" :height="200"></i-table>
			</i-card>
			<br>
			<i-card>
				<p slot="title">支付方式</p>
				<i-row class="pay-way">
				<i-col span="8">
					<div class="pay-type-item" @click="changPayIndex(PAY_TYPE.rmb)">
					<div :class="[currentPayType === PAY_TYPE.rmb ? 'icon-pay-rmb-on' : 'icon-pay-rmb']"></div>
					<p>现金支付</p>
					</div>
				</i-col>
				<i-col span="8">
					<div class="pay-type-item" @click="changPayIndex(PAY_TYPE.wechat)">
					<div :class="[currentPayType === PAY_TYPE.wechat ? 'icon-pay-wechat-on' : 'icon-pay-wechat']"></div>
					<p>微信支付</p>
					</div>
				</i-col>
				<i-col span="8">
					<div class="pay-type-item" @click="changPayIndex(PAY_TYPE.alipay)">
					<div :class="[currentPayType === PAY_TYPE.alipay ? 'icon-pay-alipay-on' : 'icon-pay-alipay']"></div>
					<p>支付宝</p>
					</div>
				</i-col>
				<!-- <i-col span="6">
					<div class="pay-type-item" @click="changPayIndex(PAY_TYPE.card)">
					<div :class="[currentPayType === PAY_TYPE.card ? 'icon-pay-vip-on' : 'icon-pay-vip']"></div>
					<p>会员卡</p>
					</div>
				</i-col> -->
				<p class="notice-msg" v-show="ifShowNotice">{{ noticeMsg }}</p>
				</i-row>

				<i-row class="margin-top-20">
					<i-col span="4">
						<span class="sum-should-pay">应付金额：</span>
					</i-col>
					<i-col span="18">
						<span class="sum-should-pay">￥ {{gslSelectedSum}}</span>
					</i-col>
				</i-row>

				<i-row class="margin-top-8">
					<i-col span="4">
						<span class="operation-staff">操作员工：</span>
					</i-col>
					<i-col span="18">
						<Select v-model="staff">
							<Option v-for="s in staffArr" :key="s.value" :value="s.value">{{ s.label }}</Option>
						</Select>
					</i-col>
				</i-row>
			</i-card>
		</i-modal>

		<i-modal title="结账确认" v-model="ifShowWechatPay" @on-ok="payCodeConfirm" @on-cancel="cancelPay">
			<i-form label-position="left" :label-width="100" @submit.native.prevent>
				<i-form-item label="确认金额：">
					<span>{{ gslSelectedSum }}</span>
				</i-form-item>
				<br>
				<i-form-item label="付款码：">
					<i-input ref="payCode" v-model="payCode"></i-input>
				</i-form-item>
			</i-form>
		</i-modal>

		<!-- 退回商品弹窗 -->
		<i-modal title="退回商品" v-model="ifShowGoodsBack" @on-ok="setGoodsBack">
		<i-form label-position="left" :label-width="100">
			<i-form-item label="退回的数量：">
				<i-input-number
					v-model="goodsBackCount"
					:max="goodsBackObj.count"
					:min="0"
					size="large"
					@on-keypress.native="setGoodsBack"
					@on-blur="limit"
				></i-input-number>
			</i-form-item>
		</i-form>
		</i-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import dateTools from '@/tools/dateTools';
import mixins from './goodsellMinxins/mixins';
import Menu from '@/components/menu';
import OutModal from './components/out-modal.vue';
import print from '@/tools/print';

const PAY_TYPE = {
	rmb: 1,
	wechat: 2,
	alipay: 3,
	card: 4
};
export default {
	name: 'sellIndex',
	mixins: [mixins],
	components: {
		OutModal,
		Menu
	},
	filters: {
		payWayFilters (v) {
			let strArr = [
				'',
				'现金',
				'微信支付',
				'支付宝',
				'会员卡'
			];
			return strArr[v];
		},
		totalprice (v) {
			return parseFloat(v).toFixed(2);
		}
	},
	data () {
		return {
			btnText: '取消',
			canUse: true,
			isLoading: true,
			ifShowNotice: false, // 正式版才可用flag
			listQueryOption: { // 查看条件
				currentPage: 1,
				state: 0,
				pageSize: 10,
				startTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(Date.now() - 30 * 24 * 3600 * 1000)),
				endTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date())
			},
			daterange: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()], // 30 d
			ifShowDetail: false, // 查看详情flag
			statusName: [{ // 订单状态
				value: 0,
				label: '全部'
			}, {
				value: 1,
				label: '待确认'
			}, {
				value: 2,
				label: '已确认'
			}],
			goodsellOrderList: [], // 商品数据
			detailData: {
				totalCount: 0,
				totalPrice: 0,
				orderDetailData: []
			},

			totalPages: 20,
			ifShowMenu: false, // 售出菜单显示flag
			isTableLoading: false, // 是否有数据显示flag

			ifShowGoodsBack: false, // 退回商品窗口flag
			// goodsBackMax: 0,
			goodsBackObj: { // 退回的商品
				// maxCount: 0,
				count: 0
			},
			goodsBackCount: 1,

			ifShowPay: false, // 支付弹窗flag
			ifShowWechatPay: false, // 显示支付
			ifLoaing: false,
			currentPayType: 1,
			staff: '', // 员工
			noticeMsg: '',
			staffArr: [], // 收费员工列表
			payCode: '', // 付款码
			gslPayCol: [
				{
					title: '商品名称',
					key: 'name'
				},
				{
					title: '数量',
					key: 'count'
				},
				{
					title: '单价',
					key: 'price',
					render: (h, params) => {
						return h('span', parseFloat(params.row.price).toFixed(2));
					}
				},
				{
					title: '总价',
					key: 'sum',
					render: (h, params) => {
						return h('div', (params.row.count * params.row.price).toFixed(2));
					}
				}
			]
		};
	},
	created () {
		this.getListData();
		this.getStaffList();
	},
	methods: {
		// 获取数据
		getListData () {
			this.isTableLoading = true;
			this.$http.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/list', this.listQueryOption)
				.then(res => {
					this.isTableLoading = false;
					if (res.data.errCode === '000000') {
						const RESULT = res.data.result;
						this.totalPages = RESULT.total;
						this.goodsellOrderList = RESULT.list;
						// console.log(this.goodsellOrderList);
					}
				})
				.catch(e => {
					console.log(e);
					this.isTableLoading = false;
				});
		},
		// 查询
		query () {
			let lqo = this.listQueryOption;
			if (this.daterange.length && this.daterange[0] !== null) {
				lqo.startTime = dateTools.format('yyyy-MM-dd hh:mm:ss', this.daterange[0]);
				lqo.endTime = dateTools.format('yyyy-MM-dd hh:mm:ss', this.daterange[1]);
			} else {
				lqo.startTime = dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(Date.now() - 30 * 24 * 3600 * 1000)); // 30 days
				lqo.endTime = dateTools.format('yyyy-MM-dd hh:mm:ss', new Date());
			}

			this.getListData();
		},
		// 换页
		pageChange (num) {
			this.listQueryOption.currentPage = num;
			this.getListData();
		},
		// 限制退回商品数量 有小数点向下取整
		limit () {
			let str = (this.goodsBackCount.toString()).indexOf('.');
			if (str !== -1) {
				this.goodsBackCount = Math.floor(this.goodsBackCount);
			}
		},
		// 退回商品
		setGoodsBack () {
			// this.goodsBackMax = this.detailData.count;
			if (this.goodsBackCount > 0) {
				const postData = {
					orderId: this.detailData.id,
					goodsId: this.goodsBackObj.goodsId,
					count: this.goodsBackCount
				};
				this.$http
					.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/reduceGoods', postData)
					.then(res => {
						if (res.data.errCode === '000000') {
							this.$Message.success('退回成功！');
							this.goodsBackCount = 1;
							this.detailData.totalCount -= postData.count;
							this.detailData.totalPrice -= this.detailData.orderDetailData[this.goodsBackObj.index].price * postData.count;
							this.detailData.orderDetailData[this.goodsBackObj.index].totalPrice -= this.detailData.orderDetailData[this.goodsBackObj.index].price * postData.count;
							updateTableRowData(this.goodsBackObj.index, this.detailData.orderDetailData);
							this.getListData();
						} else {
							this.$Message.error(`${res.data.errMsg}`);
						}
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this.$Message.srror('退回数量不能为0');
			}

			function updateTableRowData (index, table) {
				// 更新 查看弹窗 中数据table的row数据
				table[index].count--;
				if (table[index].count === 0) {
					table.splice(index, 1);
				}
			}
		},
		// 查看商品
		checkOrder (v) {
			this.detailData = {
				orderId: v.orderId,
				createTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(v.createTime)),
				totalCount: v.totalCount,
				totalPrice: v.totalPrice,
				payWay: v.payWay,
				id: v.id,
				state: v.state,
				type: v.type,
				teaShoppingOrderGoods: v.teaShoppingOrderGoods
				// state: getStateStr(v.state, v.type)
			};
			this.detailData.orderDetailData = v.teaShoppingOrderGoods;
			if (this.detailData.state === 2 && this.detailData.type === 1) {
				this.btnText = '确定订单';
			} else if ((this.detailData.state === 4 && this.detailData.type === 1) ||
						(this.detailData.state === 5 && this.detailData.type === 1) ||
						(this.detailData.state === 5 && this.detailData.type === 3)) {
				this.btnText = '打印订单';
			}
			this.ifShowDetail = true;
		},
		confirmedOrPrint (detail) {
			if (detail.state === 2 && detail.type === 1) {
				this.confirmedOrder(detail.id);
			} else if ((detail.state === 4 && detail.type === 1) ||
						(detail.state === 5 && detail.type === 1) ||
						(detail.state === 5 && detail.type === 3)) {
				this.printTicket(detail);
			}
		},
		// 打印订单
		printTicket (detail) {
			const { orderId, createTime, payWay, teaShoppingOrderGoods, totalCount, totalPrice } = detail;
			const printData = {
				orderNo: orderId,
				createTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(createTime)),
				buyerInfo: '',
				printTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date()),
				goodsList: teaShoppingOrderGoods.map(goods => {
					goods.unitPrice = goods.price;
					return goods;
				}),
				goodsCount: totalCount,
				receivedMoney: totalPrice,
				paymentType: ['', '现金', '微信支付', '支付宝', '会员卡'][payWay]
			};
			print(printData);

			// this.$http
			// 	.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/teaOrderReceiptPrint', {
			// 		orderId: id
			// 	})
			// 	.then(res => {
			// 		if (res.data.errCode === '000000') {
			// 			this.$Message.success('打印成功！');
			// 		} else {
			// 			this.$Message.error(`[${res.data.errCode}]: ${res.data.errMsg}`);
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	});
		},
		// 确认订单
		confirmedOrder (id) {
			this.$http
				.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/confirmOrder', {
					orderId: id
				})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('确认订单成功！');
						this.ifShowDetail = false;
						this.getListData();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 获取收费人员的列表
		getStaffList () {
			this.$request.post('/GoodsSales/tableStaff')
				.then(res => {
					if (res.errCode === '000000') {
						this.staffArr = res.result.data;
						this.staff = this.staffArr[0].value;
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 取消售出
		addCancel () {
			// 商品售出弹窗中 取消
			this.$store.commit('setBackGslSelected');
			this.ifShowMenu = false;
		},
		// 取消售出，返回商品
		sentBcakGsl () {
			if (this.ifShowMenu === false && this.ifShowPay === false && this.ifShowWechatPay === false && this.$Modal.confirm.title !== '结账确认') {
				this.$store.commit('setBackGslSelected');
			}
		},
		// 售出商品确认提交
		handleSubmit () {
			if (this.$store.getters.gslSelectedList.length === 0) {
				this.$Message.error('请先选择商品！');
				return;
			}
			this.ifShowMenu = false;
			this.ifShowPay = true;
		},
		// 取消支付
		cancelPay () {
			this.$store.commit('setBackGslSelected');
			this.payCode = '';
		},
		// 支付
		pay () {
			switch (this.currentPayType) {
				case PAY_TYPE.rmb:
					this.payByRMB();
					break;
				case PAY_TYPE.wechat:
					this.payByWechat();
					break;
				case PAY_TYPE.alipay:
					this.payByAlipay();
					break;
				case PAY_TYPE.card:
					this.payByCard();
					break;
				default:
					break;
			}
			this.ifShowPay = false;
		},
		// 支付方式 -- RMB
		payByRMB () {
			this.$Modal.confirm({
				title: '结账确认',
				loading: true,
				content: '确认金额 ' + this.gslSelectedSum + ' ?',
				onOk: () => {
					this.payHandler('', () => {
						this.$Modal.remove();
						this.getListData();
					});
				},
				onCancel: () => {
					this.$store.commit('setBackGslSelected');
				}
			});
		},
		// 支付方式 -- 微信
		payByWechat () {
			this.ifShowWechatPay = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		// 支付方式 -- 支付宝
		payByAlipay () {
			this.ifShowWechatPay = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		// 支付方式 -- 会员卡
		payByCard () {
			this.$Message.error('暂未开放');
		},
		payCodeConfirm () {
			this.payHandler(this.payCode, () => {
				this.ifShowWechatPay = false;
			});
			this.payCode = '';
		},
		payHandler (payCode = '', cb = null) {
			let gsSelected = this.$store.getters.gslSelectedList.map(x => {
				return {
					goodsId: x.id,
					count: x.count
				};
			});
			let postData = {
				teaHouseId: this.teaHouseId,
				teaShoppingGoods: gsSelected,
				payWay: this.currentPayType,
				payCode: payCode,
				staffId: this.staff
			};
			this.$http
				.request(this, 'POST', '/GoodsSales/TeaShoppingOrder/sale ', postData)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('支付成功！');
						this.getListData();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
					cb && cb();
					this.$store.commit('clearGslSelected');
				})
				.catch(err => {
					console.log(err);
				});
		},
		changPayIndex (index) {
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
		}
	},
	computed: {
		...mapGetters(['gslSelectedList', 'gslSelectedSum', 'wxPayState', 'aliPayState']),
		PAY_TYPE () {
			return PAY_TYPE;
		},
		ifNeedMsgGoodsellUpdataFlag () {
			return this.$store.state.app.ifNeedMsgGoodsellUpdataFlag;
		}
	},
	watch: {
		ifNeedMsgGoodsellUpdataFlag: {
			immediate: true,
			handler (flag) {
				if (flag) {
					if (this.listQueryOption.state === 0 || this.listQueryOption.state === 1) {
						this.getListData();
					}
					this.$store.commit('setIfNeedMsgGoodsellUpdataFlag', false);
				}
			}
		}
	}
};
</script>
