<style lang="less" scoped>


</style>

<template>
  <div>
    <i-modal
      title="结账确认"
      footer-hide
      v-model="ifShowPayCode"
      @on-cancel="resetPayCode"
	>
      <i-form label-position="left" :label-width="80" @submit.native.prevent >
          <i-form-item label="确认金额：">
              <span>{{ priceObj.totalPrice }}</span>
          </i-form-item>
          <br>
          <i-form-item label="付款码：">
              <i-input ref='payCode' v-model="payCode" @on-keypress.enter="payCodeConfirm"></i-input>
          </i-form-item>
      </i-form>
    </i-modal>

    <i-modal
      title="会员卡结账确认"
      v-model="ifShowCardPay"
      @on-cancel="resetPayCode">
      <i-form label-position="left" :label-width="80" @submit.native.prevent>
          <i-form-item label="会员卡号：">
              <i-input ref='cardCode' v-model="cardCode" @on-keypress.enter="getCardBalance"></i-input>
          </i-form-item>
          <br>
          <i-form-item label="卡上余额：">
              <span>{{ cardBalance }}</span>
          </i-form-item>
           <i-form-item label="应扣金额：">
              <span>{{ priceObj.totalPrice }}</span>
          </i-form-item>
      </i-form>
      <div slot="footer">
          <Button type="primary" size="large" :disabled="!isEnough" @click="confirm2Deduct">确认扣费</Button>
      </div>
    </i-modal>
  </div>
</template>

<script>
export default {
	name: 'allThePay',
	props: {
		priceObj: {}
	},
	data () {
		return {
			// membership card pay
			ifShowCardPay: false,
			cardCode: '',
			cardBalance: 0,

			// wechat pay &  ali pay
			ifShowPayCode: false,
			payCode: ''
		};
	},
	computed: {
		isEnough () {
			return this.cardBalance >= this.priceObj.totalPrice;
		}
	},
	methods: {
		resetPayCode () {
			// 重置支付码
			this.payCode = '';
			this.cardCode = '';
		},
		payByWechat () {
			this.ifShowPayCode = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		payByAlipay () {
			this.ifShowPayCode = true;
			this.$nextTick(() => {
				this.$refs.payCode.focus();
			});
		},
		payByCard () {
			// 会员卡支付
			this.ifShowCardPay = true;
			this.$nextTick(() => {
				this.$refs.cardCode.focus();
			});
		},
		payCodeConfirm () {
			// 输入支付码后
			this.$emit('payHandler', this.payCode, () => {
				this.ifShowPayCode = false;
				this.resetPayCode();
			});
		},
		getCardBalance () {
			if (this.cardCode === '') {
				return this.$Message.error('会员卡号为空');
			}
			// 读取会员卡号后获取会员卡余额
			this.$http.request(this, 'POST', '/teaOrder/vip_member', {mc_code: this.cardCode})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.cardBalance = res.data.result.balance;
					} else {
						this.$Message.error(res.data.errMsg);
					}
				})
				.catch(err => {});
		},
		confirm2Deduct () {
			this.$emit('payHandler', this.cardCode, () => {
				this.ifShowCardPay = false;
				this.resetPayCode();
			});
		}
	}
};
</script>
