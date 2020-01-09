<style lang="less" scoped>
    .deliveryDetail{
        width: 95%;
        margin-left: 2.5%;
        height: 587px;
        background-color: #e4e4e2;
        border-radius: 10px;
        .header{
            width: 100%;
            height: 120px;

            .title{
                position: relative;
                width: 98%;
                margin-left: 1%;
                height: 62px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #dcdcdc;
                h2{
                    color: #5c5c5c;
                    margin-left: 15px;
                }
                .returnList{
                    position: absolute;
                    right: 35px;
                    top: 13px;
                }
            }
            .state{
                position: relative;
                width: 98%;
                margin-left: 1%;
                height: 58px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #dcdcdc;
                h3{
                    color: #776d53;
                    margin-left: 33px;
                }
                .deliveryDoos{
                    position: absolute;
                    right: 35px;
                    top: 13px;
                }
            }
        }
        .detail{
            width: 100%;
            .buyerDetail{
                font-family: AdobeHeitiStd-Regular;
                margin-left: 34px;
                margin-top: 22px;
                font-size: 14px;
                line-height: 23px;
                letter-spacing: 2px;
                color: #555453;
                .buyerInfo{
                    margin-bottom: 18px;
                }
            }
            .card{
                margin-top: 40px;
                margin-left: 15px;
                /deep/ .ivu-tabs-tab{
                    background: #e4e4e2;
                }
                /deep/ .ivu-tabs-tab-active{
                    background-color: #eaeaea;
                }
                // .card-order, .card-delivery{
                //     width: 100%;
                //     background: #eaeaea;
                // }
            }
        }
    }
</style>

<template>
    <div class="deliveryDetail">
        <header class="header">
            <div class="title">
                <h2>订单详情</h2>
                <i-button class="returnList" type="primary" @click="goBack">返回列表</i-button>
            </div>
            <div class="state">
                <h3>{{deliveryState}}</h3>
                <i-button v-if="this.OrderGoods.state === 2" class="deliveryDoos" type="primary" @click="deliveryDoos">发货</i-button>
            </div>
        </header>
        <section class="detail">
            <div class="buyerDetail">
                <div class="buyerInfo">买家信息：{{userInfo}}</div>
                <div class="deliveryAddress">发货地址：{{addressDetails}}</div>
            </div>
            <Tabs type="card" class="card">
                <TabPane label="订单详情" class="card-order">
                    <orders-detail :OrderGoods="OrderGoods" :createTime="createTime" :orderId="orderId" :userInfo="userInfo" />
                </TabPane>
                <TabPane label="物流信息" class="card-delivery">
                    <delivery-info :freightNo="freightNo" :CompanyId="CompanyId" :freightTime="freightTime" />
                </TabPane>
            </Tabs>
        </section>
        <!-- 发货 -->
		<i-modal v-model="ifShowSendDelivery" title="商品发货" ok-text="发货" @on-ok="sendDelivery()">
			<Form>
				<i-row>
					<i-form-item label="物流单号">
						<Input v-model="sendDeliveryInfo.freightNo" style="width: 85%"/>
					</i-form-item>
				</i-row>
				<i-row>
					<i-form-item label="物流单号">
						<Select class="good-state" v-model="sendDeliveryInfo.freightCompanyId" style="width: 85%">
							<Option v-for="item in freightCompanyId" :value="item.value" :key="item.index" >{{ item.label }}</Option>
						</Select>
					</i-form-item>
				</i-row>
			</Form>
		</i-modal>
    </div>
</template>

<script>
import ordersDetail from './components/ordersDetail';
import deliveryInfo from './components/deliveryInfo';
export default {
	name: 'ordre-detail',
	components: {
		ordersDetail,
		deliveryInfo
	},
	data () {
		return {
			userInfo: '', // 买家信息
			addressDetails: '', // 地址

			createTime: 0, // 下单时间
			orderId: '', // 订单编号
			OrderGoods: [], // 商品信息

			freightNo: '', // 物流单号
			CompanyId: 0, // 快递公司
			freightTime: 0, // 发货时间

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
			}]
		};
	},
	created () {
		this.getOrderList();
	},
	methods: {
		getOrderList () {
			let orderId = this.$route.query.id;
			this.$http.request(this, 'POST', '/GoodsSales/ExpressOrder/detail', { orderId })
				.then(res => {
					if (res.data.errCode === '000000') {
						this.userInfo = res.data.result.userInfo;
						this.addressDetails = res.data.result.addressDetails;
						this.createTime = res.data.result.createTime;
						this.orderId = res.data.result.orderId;
						this.OrderGoods = res.data.result.teaShoppingOrderGoods;
						this.OrderGoods.state = res.data.result.state;
						this.OrderGoods.orderId = res.data.result.orderId;

						this.freightNo = res.data.result.freightNo;
						this.CompanyId = res.data.result.freightCompanyId;
						this.freightTime = res.data.result.freightTime;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		goBack () {
			this.$router.go(-1);
		},
		// 发货
		deliveryDoos () {
			this.ifShowSendDelivery = true;
			this.sendDeliveryInfo.orderId = this.$route.query.id;
		},
		sendDelivery () {
			this.$http.request(this, 'POST', '/GoodsSales/ExpressOrder/OrderDelivery', this.sendDeliveryInfo)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.ifShowSendDelivery = false;
						this.$Message.success('发货成功！');
						this.getOrderList();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	computed: {
		deliveryState () {
			let str = '';

			if (this.OrderGoods.state === 1) {
				str = '未付款';
			} else if (this.OrderGoods.state === 2) {
				str = '待发货';
			} else if (this.OrderGoods.state === 3) {
				str = '已发货';
			} else if (this.OrderGoods.state === 4 || this.OrderGoods.state === 5) {
				str = '已完成';
			} else if (this.OrderGoods.state === 6) {
				str = '退款/售后';
			} else if (this.OrderGoods.state === 7) {
				str = '已关闭';
			}
			return str;
		}
	}
};
</script>


