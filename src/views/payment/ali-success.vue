<style lang="less" scoped>
.ali {
	// display: flex;
	width: 960px;
	height: 560px;
	margin: 40px auto;
	padding: 40px;
	background-color: #fff;
	border-radius: 8px;

	.title {

	}

	.content {
		margin-top: 40px;
		text-align: center;

		.txt {
			font-size: 36px;
			color: #0AE;
		}
	}
}
</style>

<template>
	<div class="ali">
		<div class="title">
			<img src="https://t.alipayobjects.com/images/T1HHFgXXVeXXXXXXXX.png" alt="">
		</div>
		<div class="content">
			<Icon type="ios-checkmark" size="140" color="#0AE" />
			<div class="txt">支付成功</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'paymentAliSuccess',
	mounted () {
		// setTimeout(() => {
		// 	this.close();
		// }, 1000);
	},
	methods: {
		// clo
		close () {
			try {
				window.opener = window;
				var win = window.open('', '_self');
				win.close();
				// frame的时候
				top.close();
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>
