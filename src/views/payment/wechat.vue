<style lang="less" scoped>
.wechat {
	display: flex;
	width: 960px;
	height: 480px;
	margin: 40px auto;
	padding: 40px 0;
	background-color: #fff;

	.qrcode {
		flex: 1;
		padding-top: 50px;
		border-right: 1px dashed #d1d1d1;
		text-align: center;

		.scan-qrcode {

			.img-wrapper {
				position: relative;
				width: 200px;
				// height: 200px;
				margin: 0 auto;
				img {
					width: 100%;
				}
				.mask {
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					z-index: 1;
					background-color: rgba(0, 0, 0, 0.8);

					&-content {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						font-size: 20px;
						color: #f2f2f2;
					}

				}
			}
		}

	}
	.info-wrapper {
		flex: 1;
		padding-top: 100px;
		text-align: center;

		.info {
			display: inline-block;
			text-align: left;
			.price {
				font-size: 42px;
				margin-top: 10px;
				span {
					display: inline-block;
					font-size: 24px;
					vertical-align: top;

				}
			}
			.detail {
				margin-top: 10px;
				font-size: 14px;
				line-height: 22px;
			}
		}
	}
}
</style>

<template>
	<div class="wechat">
		<div class="qrcode">
			<div class="scan-qrcode">
				<div class="img-wrapper">
					<img src="./images/icon-wxPay.png" style="width: 200px;" alt="微信支付">
					<img :src="qrCodeUrl" alt="">
					<div class="mask" v-if="paySuccess">
						<div class="mask-content">
							支付成功
						</div>
					</div>
				</div>
				<p>请使用微信扫一扫</p>
			</div>
		</div>
		<div class="info-wrapper">
			<div class="info">
				<h1 class="title">智慧管家订单</h1>
				<div class="price">
					<span>￥</span>
					{{ price }}
				</div>
				<div class="detail">
					<p>收款方: 广州麒龙茶典运营管理有限公司</p>
					<p>下单时间：{{ new Date() | formatTime }}</p>
					<p>订单号：{{ paymentID }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import dateTools from '@/tools/dateTools';

export default {
	name: 'paymentWechat',
	filters: {
		formatTime (date) {
			return dateTools.format('yyyy-MM-dd hh:mm:ss', date);
		}
	},
	data () {
		return {
			qrCodeUrl: this.$route.query.qrCodeUrl,
			price: this.$route.query.price,
			paymentID: this.$route.query.paymentID,
			paySuccess: false
		};
	},
	created () {
		this.queryPayStatus();
	},
	methods: {
		queryPayStatus () {
			const params = {
				paymentID: this.paymentID,
				paymentWay: 1
			};

			let rotation = () => {
				this.$request.post('/webPay/paymentStatus', params)
					.then(res => {
						if (res.errCode === '000000') {
							if (parseInt(res.data.paymentStatus) === 1) {
								this.paySuccess = true;
							} else {
								setTimeout(rotation, 3000);
							}
						}
					})
					.catch(err => {
						console.error(err);
					});
			};

			rotation();
		}
	}
};
</script>
