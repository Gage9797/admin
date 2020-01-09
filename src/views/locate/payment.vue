<style lang="less" scoped>
@import './common.less';
.payment {
	padding: 50px 20px 0;
	border-top: 1px solid #dcdcdc;

	.for-more {
		font-size: 10px;
		line-height: 23px;
		letter-spacing: 1px;
		color: #999894;

		a {
			color: #1996de;
		}
	}
	.supplement {

		.agree-text {
			color: #999894;
		}

		.check-protocol-con {
			cursor: pointer;
			color: #1996de;
		}
	}

	.price {
		line-height: 24px;
		.price-discount{
			font-size: 24px;
			letter-spacing: 3px;
			color: #e8c66b;
		}
	}
}

.remind {
	font-size: 16px;
}
.customer-service {
	margin-top: 10px;
	&-way {
		// text-indent: 24px;
		span {
			color: #1996de;
		}
	}
}


.spin-icon-load{
	animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
	from { transform: rotate(0deg);}
	50%  { transform: rotate(180deg);}
	to   { transform: rotate(360deg);}
}
</style>

<template>
	<div class="payment">
		<Form ref="payForm" :model="payForm" :rules="payFormRules" :label-width="80">

			<FormItem label="系统名称" prop="productID">
				<radio-group v-model="payForm.productID">
					<radio
						v-for="product in productList"
						:key="product.productID"
						:value="product.productID"
						:label="product.productName" />
				</radio-group>
				<p class="for-more">了解标准版详细功能，可选择 <a href="#">更多</a > 。</p>
			</FormItem>
			<FormItem label="购买年限" prop="productID">
				<radio-group v-model="payForm.optionID">
					<radio
						v-for="planOption in currentProductOption"
						:key="planOption.optionID"
						:value="planOption.optionID"
						:label="`${planOption.duration}年（${planOption.discount}折）`" />
				</radio-group>
				<p class="for-more">了解更多详情，可 <a @click="getCustomerService">咨询客服</a > 。</p>
			</FormItem>
			<FormItem label="价格合计" prop="price">
				<p class="price"><span class="price-discount">{{ priceAfterDiscount }} 元 </span><s>{{ price }} 元</s></p>
			</FormItem>
			<FormItem label="支付方式" prop="paymentWay">
				<radio-group v-model="payForm.paymentWay">
					<radio
						v-for="paymentWay in paymentWayList"
						:key="paymentWay.value"
						:value="paymentWay.value"
						:label="paymentWay.label" />
				</radio-group>
				<div class="supplement">
					<Checkbox v-model="hasReadProtocol"><span class="agree-text">我已阅读并同意</span></Checkbox>
					<a href="#/serviceProtocol" target="_blank" class="check-protocol-con">《麒龍茶典智慧管家系统服务协议》</a>
				</div>
			</FormItem>

			<footer class="btn-wrapper">
				<Button type="primary" class="btn" :loading="previewLoading" @click="preHandler">上一步</Button>
				<Button type="primary" class="btn" :loading="nextLoading" @click="nextHandler">下一步</Button>
			</footer>
		</Form>

		<!-- 支付确认弹窗 -->
		<Modal
			v-model="payModal"
			title="支付确认"
			:closable="false"
			:mask-closable="false">
			<div class="modal-content">
				<Row>
					<Col span="11">
						<p class="remind">请在新打开的页面完成支付。</p>
					</Col>
					<Col span="1">
						<Spin>
							<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
						</Spin>
					</Col>
				</Row>

				<div class="customer-service">
					<!-- <p class="customer-service-way">若支付过程遇到问题，可联系客服：<span>{{ tel }}</span>，或添加微信号：<span>{{ wechat }}</span>。</p> -->
					<p class="customer-service-way">若支付过程遇到问题，可联系客服：<span>{{ tel }}</span>，或添加微信号
						<Poptip trigger="hover" placement="bottom-start">
							<span style="font-weight: bold;">“ 麒龙小二 ”</span>
							<div slot="content">
								<img width="200px" src="./images/QRCode.jpg" alt="">
							</div>
						</Poptip>，进行在线咨询
					</p>

					<!-- <p class="customer-service-way">客服热线：！</p>
					<p class="customer-service-way">您还可以，进行在线咨询</p> -->
				</div>
			</div>
			 <div slot="footer">
				<Button type="text" @click="onCancel">取消支付</Button>
				<Button type="primary" @click="onConfirm" :loading="payConfirmLoading">确认支付</Button>
			</div>
		</Modal>

		<!-- 客服联系方式弹窗 -->
		<Modal
			v-model="customerServiceModal"
			title="联系客服">
			<div>
				<p class="customer-service">客服热线：<span>{{ tel }}</span>，竭诚为您服务！</p>
				<!-- <p class="customer-service">您还可以添加微信号：<span>{{ wechat }}</span>，进行在线咨询</p> -->
				<p class="customer-service">您还可以添加微信号<span style="font-weight: bold;">“ 麒龙小二 ”</span>，进行在线咨询
					<Poptip trigger="hover" placement="bottom-start">
						<img style="display: inline-block; vertical-align: text-bottom; width: 16px; margin-left: 4px;" src="./images/wechat.svg" alt="">
						<div slot="content">
							<img width="200px" src="./images/QRCode.jpg" alt="">
						</div>
					</Poptip>
				</p>
			</div>
			 <div slot="footer"></div>
		</Modal>
	</div>
</template>

<script>
import { RadioGroup, Radio } from '@/components/ql-radio';

export default {
	name: 'locatePayment',
	components: {
		RadioGroup,
		Radio
	},
	data () {
		return {
			payForm: {
				productID: '',
				optionID: '',
				paymentWay: 1
			},
			payFormRules: {},
			productList: [],
			paymentWayList: [
				{
					value: 1,
					label: '微信'
				}, {
					value: 2,
					label: '支付宝'
				}
				// , {
				// 	value: 3,
				// 	label: '银行卡'
				// }
			],
			hasReadProtocol: false,
			previewLoading: false,
			nextLoading: false,
			payConfirmLoading: false,
			paymentID: '',
			redirectURL: '',
			payModal: false,
			customerServiceModal: false,
			tel: '',
			wechat: ''
		};
	},
	computed: {
		currentProductOption () {
			let currentProduct = this.productList.find(item => item.productID === this.payForm.productID);
			if (!currentProduct) {
				return [];
			}
			return currentProduct.planOption;
		},
		price () {
			const option = this.currentProductOption.find(item => item.optionID === this.payForm.optionID);
			if (option) {
				return option.price;
			} else {
				return 0;
			}
		},
		priceAfterDiscount () {
			const option = this.currentProductOption.find(item => item.optionID === this.payForm.optionID);
			if (option) {
				return (Number(this.price) * Number(option.discount) / 10).toFixed(2);
			} else {
				return '';
			}
		}
	},
	created () {
		// customerService
		this.$request.get('/join/customerService')
			.then(res => {
				if (res.errCode === '000000') {
					this.tel = res.result.tel;
					this.wechat = res.result.wechat;
				}
			})
			.catch(err => {
				console.error(err);
			});

		this.$request.get('/webPay/payStatus')
			.then(res => {
				if (res.errCode === '000000') {
					const productList = this.productList = res.result.productList;
					this.payForm.productID = productList[0].productID;
					this.payForm.optionID = productList[0].planOption[0].optionID;
				} else {
					this.$Message.error(res.errMsg);
				}
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		getCustomerService () {
			this.customerServiceModal = true;
		},
		preHandler () {
			this.$router.push({
				name: 'locateQualification'
			});
		},
		nextHandler () {
			if (!this.hasReadProtocol) {
				this.$Message.error('请先阅读服务协议');
				return false;
			}

			// 模拟用户点击打开的行为，在用户触发的时间里 "同步" 打开。而后在该实例里 重定向。
			this._window = window.open('', '_blank');

			const params = {
				productID: this.payForm.productID,
				optionID: this.payForm.optionID,
				paymentWay: this.payForm.paymentWay
			};

			this.nextLoading = true;
			this.$request.post('/webPay/pay', params)
				.then(res => {
					this.nextLoading = false;
					if (res.errCode === '000000') {
						this.payModal = true;
						this.paymentID = res.result.paymentID;
						this.redirectURL = res.result.redirectURL;
						this.openWindow();
					} else {
						this._window.close();
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					this.nextLoading = false;
					console.error(err);
				});
		},
		openWindow () {
			let newUrl = '';

			// const location = window.location;
			// // 浏览器的安全策略会默认拦截 window.open 打开的窗口
			// let a = document.getElementById('ql_pay');
			// if (!a) {
			// 	a = document.createElement('a');
			// }
			// a.setAttribute('id', 'ql_pay');
			// a.setAttribute('target', '_blank');

			if (parseInt(this.payForm.paymentWay) === 1) {
				// wechat pay
				newUrl = location.origin + location.pathname + '#/payment/wechat?qrCodeUrl=' + this.redirectURL + '&price=' + this.priceAfterDiscount + '&paymentID=' + this.paymentID;
			} else if (parseInt(this.payForm.paymentWay) === 2) {
				// ali pay
				newUrl = location.origin + location.pathname + '#/payment/ali';
				window.localStorage.setItem('ALI_PAY_FORM', this.redirectURL);
			}
			// document.body.appendChild(a);
			// a.setAttribute('href', newUrl);
			// a.click();
			// window.open(newUrl, '_blank');

			// 重定向
			this._window.location.href = newUrl;
		},
		onConfirm () {
			const params = {
				paymentID: this.paymentID,
				paymentWay: this.payForm.paymentWay
			};
			this.payConfirmLoading = true;
			this.$request.post('/webPay/paymentStatus', params)
				.then(res => {
					this.payConfirmLoading = false;
					if (res.errCode === '000000') {
						if (parseInt(res.result.paymentStatus) === 1) {
							this.payModal = false;
							this.$router.push({
								name: 'locateAudit'
							});
						} else if (parseInt(res.result.paymentStatus) === 2) {
							this.$Message.error('请先支付订单');
						}
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					this.payConfirmLoading = false;
					console.log(err);
				});
		},
		onCancel () {
			// this.payModal = false;
			if (this.paymentID === '') {
				this.payModal = false;
			} else {
				const params = {
					paymentID: this.paymentID,
					paymentWay: this.payForm.paymentWay
				};
				this.$request.post('/webPay/paymentStatus', params)
					.then(res => {
						if (res.errCode === '000000') {
							if (parseInt(res.result.paymentStatus) === 1) {
								this.$Message.success('检测到您已支付成功，请确认支付。');
							} else if (parseInt(res.result.paymentStatus) === 2) {
								this.payModal = false;
							}
						} else {
							this.payModal = false;
						}
					})
					.catch(err => {
						this.payConfirmLoading = false;
						console.error(err);
					});
			}
		}
	}
};
</script>
