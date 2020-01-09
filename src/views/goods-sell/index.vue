<style lang="less" scoped>
@import "~@/styles/icon-pay.less";

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
.sum-should-pay {
	font-size: 12px;
	margin-top: 30px;
	color: #1c2438;
	font-weight: 700;
}
.operation-staff {
	font-size: 12px;
	display: inline-block;
	line-height: 30px;
	color: #1c2438;
	font-weight: 700;
}
.modal-p {
  text-indent: 4px;
  line-height: 2;
  margin: 10px 0;
}

main {
  margin-top: 10px;
  padding-top: 10px;
  background-color: #fff;
}

footer {
  margin-top: 20px;
  text-align: center;
}
.sell-wrapper {
  position: relative;
  background: rgb(228, 228, 226);
  padding: 20px;
  border-radius: 16px;
}
.page-wrapper {
  position: absolute;
  bottom: 20px;
  left: 48%;
  transform: translateX(-50%);
}
.goods-table {
  margin-top: 20px;
  margin-bottom: 50px;
}
.goods-sell-button {
  position: absolute;
  top: 30px;
  right: 60px;
}
.selection-wrapper {
  margin-top: 10px;
  border-bottom: 1px solid rgb(210, 210, 210);
}
.sell-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
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

/deep/ .ivu-table td {
  background: rgb(235, 235, 233);
  border-bottom: 1px solid rgb(210, 210, 210);
}
/deep/ .ivu-table th {
  background: rgb(235, 235, 233);
  border-bottom: 1px solid rgb(210, 210, 210);
  color: rgb(107, 92, 67);
}
/deep/ .ivu-input {
  background: rgb(235, 235, 233);
}
/deep/ .ivu-form-item-label {
  color: rgb(127, 128, 123);
  font-size: 14px;
}
</style>

<template>
  <div id="goods-sell">
    <div class="sell-wrapper">
      <div class="selection-wrapper">
        <i-form label-position="right" :label-width="90" inline>
          <i-form-item label="售出时段：">
            <i-date-picker type="daterange" v-model="daterange" style="width: 300px" :editable="false"></i-date-picker>
          </i-form-item>
        </i-form>
        <i-button type="primary" @click="search" class="goods-sell-button">查询</i-button>
      </div>
      <i-table :columns="gsSellCol" :data="gsSellData" class="goods-table"></i-table>
      <div class="page-wrapper">
        <i-page :current.sync="queryObj.currentPage" :total="total" :page-size="queryObj.pageSize" @on-change="pageNumChange"/>
      </div>
      <i-button type="primary" @click="openMenu" class="sell-button">商品售出</i-button>
    </div>

    <!-- 菜单 -->
    <i-modal width="1024" v-model="ifShowMenu" ok-text="下单" :loading="isLoading" title="商品售出">
      <Menu />
      <div slot="footer" style="text-align:center">
        <Button @click="cancel" type="text" size="large">取消</Button>
        <Button @click="openSell" class="modal-confirm" type="primary" size="large">确定</Button>
      </div>
    </i-modal>

    <!-- 支付相关 -->
    <i-modal v-model="ifShowPay" ok-text="结账" title="结账单" :loading="ifLoaing" @on-ok="pay">
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

    <i-modal title="结账确认" v-model="ifShowWechatPay"  footer-hide @on-ok="payCodeConfirm">
      <i-form label-position="left" :label-width="100" @submit.native.prevent >
        <i-form-item label="确认金额：">
          <span>{{ gslSelectedSum }}</span>
        </i-form-item>
        <br>
        <i-form-item label="付款码：">
          <i-input ref="payCode" v-model="payCode" @keypress.enter.native="payCodeConfirm"></i-input>
        </i-form-item>
      </i-form>
    </i-modal>

    <!-- 查看 -->
    <i-modal v-model="ifShowDetail" title="售出详情" ok-text="打印小票" @on-ok="printTicket(detailData)">
      <p class="modal-p">订 单 号：{{ detailData.orderId }}</p>
      <p class="modal-p">开单时间：{{ detailData.createTime }}</p>

      <i-table :columns="orderDetailCol" :data="detailData.orderDetailData" :height="200"></i-table>

      <p class="modal-p">商品数量：{{ detailData.totalCount }}</p>
      <p class="modal-p">收费方式：{{ detailData.payWayStr }}</p>
      <p class="modal-p">实收金额：￥ {{ detailData.totalPrice }}</p>
    </i-modal>

    <!-- 退回商品弹窗 -->
    <i-modal title="退回商品" v-model="ifShowGoodsBack" @on-ok="setGoodsBack">
		<i-form label-position="left" :label-width="100" @submit.native.prevent>
			<i-form-item label="退回的数量：">
			<i-input-number
				v-model="goodsBackCount"
				:max="goodsBackObj.num"
				:min="0"
				size="large"
				@on-keypress.enter="setGoodsBack"
			/>
			</i-form-item>
		</i-form>
    </i-modal>
  </div>
</template>


<script>
import { formatPrice } from '@/tools';
import dateTools from '@/tools/dateTools';
import { mapGetters } from 'vuex';
import Menu from '@/components/menu';
import mixins from './mixins';
import print from '@/tools/print';

const PAY_TYPE = {
	rmb: 1,
	wechat: 2,
	alipay: 3,
	card: 4
};

export default {
	mixins: [mixins],
	data () {
		return {
			canUse: true,
			ifShowNotice: false,
			noticeMsg: '',
			queryObj: {
				teaHouseId: this.$util.getTeaHouseId(),
				startTime: dateTools.format('yyyy-MM-dd 00:00:00', new Date(Date.now() - 30 * 24 * 3600 * 1000)),
				endTime: dateTools.format('yyyy-MM-dd 00:00:00', new Date()),
				pageSize: 10,
				currentPage: 1
			},
			gsSellData: [],
			total: 0,
			daterange: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()],
			isLoading: true,
			ifShowMenu: false,

			ifShowWechatPay: false,
			ifShowPay: false,
			ifLoaing: false,
			currentPayType: 1,
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
						return h('span', formatPrice(params.row.price));
					}
				},
				{
					title: '总价',
					key: 'sum',
					render: (h, params) => {
						return h('div', formatPrice(params.row.count * params.row.price));
					}
				}
			],
			payCode: '',

			ifShowGoodsBack: false,
			goodsBackCount: 0,
			goodsBackObj: {
				num: 0
			},

			staff: '',
			staffArr: []
		};
	},
	computed: {
		...mapGetters(['gslSelectedList', 'gslSelectedSum', 'wxPayState', 'aliPayState']),
		PAY_TYPE () {
			return PAY_TYPE;
		}
	},
	components: {
		Menu
	},
	created () {
		this.getListData();
		this.getStaffList();

		this.$store
			.dispatch('GetAppInfo')
			.then(({ appVersion, restTime }) => {
				this.canUse = (appVersion === 3 && restTime >= 0);
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		getListData () {
			this.$http
				.request(this, 'POST', '/teaShoppingOrder/queryList', this.queryObj)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.total = res.data.result.total;
						this.gsSellData = res.data.result.list;
					} else {
						this.$Message.error(
							`${this.res.data.errMsg}`
						);
					}
				})
				.catch(err => {});
		},
		getStaffList () {
			this.$request.post('/teaTable/tableStaff')
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
		search () {
			if (this.daterange[0]) {
				this.queryObj.startTime = dateTools.format(
					'yyyy-MM-dd 00:00:00',
					this.daterange[0]
				);
				this.queryObj.endTime = dateTools.format(
					'yyyy-MM-dd 00:00:00',
					this.daterange[1]
				);
			} else {
				this.queryObj.startTime = dateTools.format('yyyy-MM-dd 00:00:00', new Date(Date.now() - 30 * 24 * 3600 * 1000)); // 30 days
				this.queryObj.endTime = dateTools.format('yyyy-MM-dd 00:00:00', new Date(Date.now() * 2));
			}
			this.queryObj.currentPage = 1;
			this.getListData();
		},
		openMenu () {
			this.ifShowMenu = true;
		},
		openSell () {
			if (this.$store.getters.gslSelectedList.length === 0) {
				this.$Message.error('请先选择商品！');
				return;
			}
			this.ifShowMenu = false;
			this.ifShowPay = true;
		},
		cancel () {
			// 商品售出弹窗中 取消
			this.$store.commit('clearGslSelected');
			this.ifShowMenu = false;
		},
		pageNumChange (page) {
			this.queryObj.currentPage = page;
			this.getListData();
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
		},
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
				}
			});
		},
		payByWechat () {
			this.ifShowWechatPay = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		payByAlipay () {
			this.ifShowWechatPay = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		payByCard () {
			this.$Message.error('暂未开放');
		},
		payCodeConfirm () {
			this.payHandler(this.payCode, () => {
				this.ifShowWechatPay = false;
			});
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
				.request(this, 'POST', '/teaShoppingOrder/sale ', postData)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('支付成功！');
						cb && cb();
						this.getListData();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
					this.payCode = '';
					this.$store.commit('clearGslSelected');
				})
				.catch(err => {
					console.log(err);
				});
		},
		printTicket (detail) {
			console.log(detail);
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
			// 	.request(this, 'POST', '/teaOrder/teaOrderReceiptPrint', {
			// 		teaOrderId: id
			// 	})
			// 	.then(res => {
			// 		if (res.data.errCode === '000000') {
			// 			this.$Message.success('打印成功！');
			// 		} else {
			// 			this.$Message.error(`${res.data.errMsg}`);
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 	});
		},
		setGoodsBack () {
			if (this.goodsBackCount > 0) {
				const postData = {
					orderId: this.detailData.id,
					goodsId: this.goodsBackObj.goodsId,
					count: this.goodsBackCount
				};
				this.$http
					.request(this, 'POST', '/teaShoppingOrder/reduceGoods', postData)
					.then(res => {
						if (res.data.errCode === '000000') {
							this.$Message.success('退回成功！');
							this.goodsBackCount = 0;
							updateTableRowData(this.goodsBackObj.index, this.detailData.orderDetailData, postData.count);
							this.getListData();
						} else {
							this.$Message.error(`${res.data.errMsg}`);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}

			function updateTableRowData (index, table, count) {
				// 更新 查看弹窗 中数据table的row数据
				table[index].count -= count;
				if (table[index].count === 0) {
					table.splice(index, 1);
				}
			}
		}
	}
};
</script>
