<style lang="less" scoped>
.select-wrap {
//   position: absolute;
//   top: 50px;
//   left: 20px;
//   width: 95%;
//   padding-top: 10px;
    border-bottom: 1px solid rgb(210,210,210);
}
.ctrl-bar{
	position: relative;

	main {
		position: relative;
		margin-top: -10px;
		padding: 0 20px;
		background-color: #e4e4e2;
	}
}
.page {
	padding-top: 10px;
	text-align: center;
}
/deep/ .ivu-spin-fix {
	display: block;
}

.spin-icon-load{
	animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
	from { transform: rotate(0deg);}
	50%  { transform: rotate(180deg);}
	to   { transform: rotate(360deg);}
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
/deep/ .ivu-input{
  background:rgb(235,235,233);
}
/deep/ .ivu-select-selection{
  background:rgb(235,235,233);
}
/deep/ .ivu-form-item-label{
  color: rgb(127,128,123);
  font-size: 14px;
}
  .modal-p {
	text-indent: 4px;
	line-height: 2;
	margin: 10px 0;
	}
</style>
<template>
	<div id="delivery-index">
    	<div class="ctrl-bar">
			<Tabs type="card" v-model="deliveryQueryOption.expressstate">
				<TabPane label="全 部"  name="0" class="ql-tab-pane">
				</TabPane>
				<TabPane label="待付款"  name="1"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
				<TabPane label="待发货"  name="2"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
                <TabPane label="已发货"  name="3"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
				<TabPane label="已完成"  name="4"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
                <TabPane label="退款/售后"  name="5"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
				<TabPane label="已关闭"  name="6"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
			</Tabs>

			<main>
				<div class="select-wrap">
					<i-form label-position="right" :label-width="85" class="i-form">
						<i-row>
							<i-col span="7">
								<i-form-item label="订 单 时 间">
									<i-date-picker type="daterange" v-model="daterange" style="width:80%" :editable="false"></i-date-picker>
								</i-form-item>
							</i-col>
							<i-col span="6">
								<i-form-item label="商 品 名 称">
									<Input v-model="goodsName" style="width: 85%" @input="setGoodsName()" />
								</i-form-item>
							</i-col>
							<i-col span="6">
								<i-form-item label="订 单 编 号">
									<Input v-model="orderId" style="width: 80%" @input="setOrderId()"/>
								</i-form-item>
							</i-col>
							<i-col span="4" offset="1">
								<i-button type="primary" @click="search">查询</i-button>
							</i-col>
						</i-row>
					</i-form>
				</div>
				<div class="table-wrapper">
					<Table border :columns="columns" :data="goodList" class="order-table"></Table>

					<Spin fix v-show="isTableLoading">
						<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
						<div>Loading</div>
					</Spin>
				</div>
			</main>

			<div class="page">
				<Page :total="totalPages" :current.sync="deliveryQueryOption.currentPage" :page-size="deliveryQueryOption.pageSize" @on-change="pageNumChange"/>
			</div>
		</div>

		<!-- 发货 -->
		<i-modal v-model="ifShowSendDelivery" title="商品发货" ok-text="发货" @on-ok="sendDelivery()">
			<Form>
				<i-row>
					<i-form-item label="物流单号">
						<Input v-model="sendDeliveryInfo.freightNo" style="width: 85%"/>
					</i-form-item>
				</i-row>
				<i-row>
					<i-form-item label="快递公司">
						<Select class="good-state" v-model="sendDeliveryInfo.freightCompanyId" style="width: 85%">
							<Option v-for="item in freightCompanyId" :value="item.value" :key="item.index" >{{ item.label }}</Option>
						</Select>
					</i-form-item>
				</i-row>
			</Form>
		</i-modal>

		    <!-- 退款 -->
		<i-modal v-model="ifShowBack" title="退款详情">
			<p class="modal-p">订 单 号：{{ backGoodsInfo.orderId }}</p>
			<p class="modal-p">开单时间：{{ backGoodsInfo.createTime }}</p>
			<p class="modal-p">买家信息：{{ backGoodsInfo.userInfo }}</p>

			<i-table :columns="refundGoodsCol" :data="backGoodsInfo.goodsInfo" :height="200"></i-table>

			<p class="modal-p">商品数量：{{ backGoodsInfo.totalCount }}</p>
			<p class="modal-p">实收金额：￥ {{ backGoodsInfo.totalPrice }}</p>
			<!-- 重写底部按钮 -->
			<footer slot="footer">
				<Button type="primary" class="goodsell-btn" @click="refund(2)">拒绝退款</Button>
				<Button type="primary" class="goodsell-btn" @click="refund(1)">同意退款</Button>
			</footer>
		</i-modal>
	</div>
</template>
<script>
import dateTools from '@/tools/dateTools';
import mixins from './deliveryMinxins/mixins';
import { mapGetters } from 'vuex';

export default {
	name: 'deliveryIndex',
	mixins: [mixins],
	data () {
		return {
			totalPages: 1,
			goodsName: '',
			orderId: '',
			deliveryQueryOption: {
				expressstate: '0', // 快递订单状态 0-全部，1-待付款，2-待发货，3-已发货，4 5-已完成，6-退款/售后，7-已关闭
				currentPage: 1,
				pageSize: 10,
				startTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(Date.now() - 30 * 24 * 3600 * 1000)),
				endTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date())
			},
			daterange: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()],
			goodList: [],
			isTableLoading: false,
			current: 1,

			ifShowBack: false,
			backGoodsInfo: {
				orderId: 0,
				createTime: '',
				totalCount: 0,
				totalPrice: 0,
				goodsInfo: [
					{
						goodsName: '',
						totalCount: 0,
						totalPrice: '0',
						unitPrice: '0'
					}
				]
			},
			backGoods: {
				orderId: 0,
				isAgreeRefund: 999 // 1-同意退款 2-拒绝退款
			},

			ifShowSendDelivery: false, // 发货窗口flag
			sendDeliveryInfo: {
				orderId: 0, // 商品id
				freightCompanyId: 0, // 快递公司id
				freightNo: '' // 快递单号
			},
			freightCompanyId: [{ // 快递公司id
				value: 1,
				label: '顺丰快递'
			}, {
				value: 2,
				label: '百世快递'
			}, {
				value: 3,
				label: '中通快递'
			}, {
				value: 4,
				label: '申通快递'
			}, {
				value: 5,
				label: '圆通快递'
			}, {
				value: 6,
				label: '京东快递'
			}],

			client1: null
		};
	},
	created () {
		this.initTabPane();
		this.getTableData();
	},
	methods: {
		setGoodsName () {
			this.$store.commit('setQueryGoodsName', this.goodsName);
		},
		setOrderId () {
			this.$store.commit('setQueryOrderId', this.orderId);
		},
		initTabPane () {
			if (!this.$route.query.tabPane) {
				this.$router.replace({
					path: 'delivery-order',
					query: {
						tabPane: this.deliveryQueryOption.expressstate
					}
				});
			} else {
				this.deliveryQueryOption.expressstate = this.$route.query.tabPane;
			}
		},
		// 获取数据
		getTableData () {
			this.isTableLoading = true;
			if (this.$store.getters.getQueryGoodsName) {
				this.goodsName = this.$store.getters.getQueryGoodsName;
				this.deliveryQueryOption.goodsName = this.goodsName;
			}
			if (this.$store.getters.getQueryOrderId) {
				this.orderId = this.$store.getters.getQueryOrderId;
				this.deliveryQueryOption.orderId = this.orderId;
			}
			this.$http.request(this, 'POST', '/GoodsSales/ExpressOrder/expresslist', this.deliveryQueryOption)
				.then(res => {
					this.isTableLoading = false;
					if (res.data.errCode === '000000') {
						let resGoods = res.data.result.list;
						this.goodList = resGoods;
						this.totalPages = res.data.result.total;
					} else {
						this.goodList = [];
					}
				})
				.catch((error) => {
					console.log(error);
					this.isTableLoading = false;
				});
		},
		// 查询
		search () {
			let lqo = this.deliveryQueryOption;
			if (this.daterange.length && this.daterange[0] !== null) {
				lqo.startTime = dateTools.format('yyyy-MM-dd hh:mm:ss', this.daterange[0]);
				lqo.endTime = dateTools.format('yyyy-MM-dd hh:mm:ss', this.daterange[1]);
			} else {
				lqo.startTime = dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(Date.now() - 30 * 24 * 3600 * 1000)); // 30 days
				lqo.endTime = dateTools.format('yyyy-MM-dd hh:mm:ss', new Date());
			}
			if (this.goodsName !== '') {
				lqo.goodsName = this.goodsName;
			} else {
				lqo.goodsName = '';
			}
			if (this.orderId !== '') {
				lqo.orderId = this.orderId;
			} else {
				lqo.orderId = '';
			}
			lqo.currentPage = 1;
			this.getTableData();
		},
		// 订单详情
		showDetail (row) {
			this.$router.push({
				name: 'delivery_detail',
				query: {
					id: row.id
				}
			});
		},
		// 换页
		pageNumChange (num) {
			this.deliveryQueryOption.currentPage = num;
			// console.log(this.listQueryOption.currentPage);
			this.getTableData();
		},
		// 显示发货/退款窗口
		showSend (row) {
			if (row.isRefunding === 1) {
				// console.log(row);
				this.ifShowBack = true;
				this.backGoodsInfo.orderId = row.orderId;
				this.backGoodsInfo.createTime = dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(row.createTime));
				this.backGoodsInfo.userInfo = row.userInfo;
				this.backGoodsInfo.totalCount = row.totalCount;
				this.backGoodsInfo.totalPrice = row.totalPrice;

				this.backGoodsInfo.goodsInfo[0].goodsName = row.goodsName;
				this.backGoodsInfo.goodsInfo[0].totalCount = row.totalCount;
				this.backGoodsInfo.goodsInfo[0].unitPrice = row.unitPrice;
				this.backGoodsInfo.goodsInfo[0].totalPrice = row.totalPrice;
				// // ...this.backGoodsInfo.goodsInfo[0] = row;
				// this.backGoodsInfo.goodsInfo[0] = row;
				// console.log(this.backGoodsInfo.goodsInfo);

				this.backGoods.orderId = row.id;
			} else {
				this.ifShowSendDelivery = true;
				this.sendDeliveryInfo.orderId = row.id;
			}
		},
		refund (v) {
			this.backGoods.isAgreeRefund = v;
			this.$http.request(this, 'POST', '/GoodsSales/expressOrder/refund', this.backGoods)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.ifShowBack = false;
						if (v === 1) {
							this.$Message.success('退款成功');
						} else {
							this.$Message.success('拒绝退款成功');
						}
						this.getTableData();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 限制快递单号0-9
		limitFreightNo () {
			this.sendDeliveryInfo.freightNo = this.sendDeliveryInfo.freightNo.replace(/[^0-9]+/, '');
		},
		// 发货
		sendDelivery (v) {
			if (!this.sendDeliveryInfo.freightNo || this.sendDeliveryInfo.freightCompanyId === 0) {
				if (!this.sendDeliveryInfo.freightNo) {
					this.$Message.error('快递单号不能为空');
				} else {
					this.$Message.error('快递公司不能为空');
				}
			} else {
				this.$http.request(this, 'POST', '/GoodsSales/ExpressOrder/OrderDelivery', this.sendDeliveryInfo)
					.then(res => {
						if (res.data.errCode === '000000') {
							this.ifShowSendDelivery = false;
							this.$Message.success('发货成功！');
							this.orderId = 0;
							this.sendDeliveryInfo.freightNo = '';
							this.getTableData();
						} else {
							this.orderId = 0;
							this.sendDeliveryInfo.freightNo = '';
							this.$Message.error(`[${res.data.errCode}]: ${res.data.errMsg}`);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
		// // 监听刷新数据
		// subscribeNotice () {
		// 	this.client1 = new Client({address: WS_1_ADRRESS});
		// 	this.client1.on('data', (data) => {
		// 		this.processMag(data);
		// 	});
		// }
	},
	watch: {
		'deliveryQueryOption.expressstate': function (v) {
			this.deliveryQueryOption.currentPage = 1;
			this.getTableData();
			this.$router.replace({
				name: 'delivery-order',
				query: {
					tabPane: this.deliveryQueryOption.expressstate
				}
			});
		},
		ifNeedMsgDeliveryUpdataFlag: {
			immediate: true,
			handler (flag) {
				if (flag) {
					if (parseInt(this.deliveryQueryOption.expressstate) === 0) {
						this.getTableData();
					} else if (this.$store.state.app.deliveryUpdata.newState === parseInt(this.deliveryQueryOption.expressstate) || this.$store.state.app.deliveryUpdata.oldState === parseInt(this.deliveryQueryOption.expressstate)) {
						this.getTableData();
					}
					this.$store.commit('setIfNeedMsgDeliveryUpdataFlag', false);
				}
			}
		}
	},
	computed: {
		...mapGetters(['getQueryGoodsName', 'getQueryOrderId']),
		ifNeedMsgDeliveryUpdataFlag () {
			return this.$store.state.app.ifNeedMsgDeliveryUpdataFlag;
		}
	}
};
</script>
