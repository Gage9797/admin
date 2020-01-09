<style lang="less" scoped>
.deliveryIndo{
    width: 97.5%;
    margin-left: 0%;
    height: 285px;
    background-color: #eaeaea;
    .wraper{
        position: relative;
        top: 20px;
        width: 100%;
        height: 245px;
        background-color: #eaeaea;
        border-radius: 10px;
        font-size: 14px;
        .deliveryOrder{
            width: 100%;
            position: absolute;
            top: 40px;
            left: 25px;
        }
        .companyId{
            width: 100%;
            position: absolute;
            top: 80px;
            left: 25px;
        }
        .sentTime{
            width: 100%;
            position: absolute;
            top: 120px;
            left: 25px;
        }
        .noMsg{
            position: absolute;
            width: 100%;
            top: 40px;
            left: 25px;
        }
    }
}
</style>


<template>
    <div class="deliveryIndo">
        <div class="wraper" v-if="showMsg">
            <div class="deliveryOrder">物流单号：{{freightNo}}</div>
            <div class="companyId">快递公司：{{companyId}}</div>
            <div class="sentTime">发货时间：{{sentTime}}</div>
        </div>
        <div class="wraper" v-else>
            <div class="noMsg">暂无快递物流信息!!</div>
        </div>
    </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
export default {
	data () {
		return {
			showMsg: true
		};
	},
	props: {
		freightNo: {
			type: String
		},
		CompanyId: {
			type: Number
		},
		freightTime: {
			type: Number
		}
	},
	computed: {
		companyId () {
			let str = '';
			if (this.CompanyId === 1) {
				str = '顺丰快递';
			} else if (this.CompanyId === 2) {
				str = '百世快递';
			} else if (this.CompanyId === 3) {
				str = '中通快递';
			} else if (this.CompanyId === 4) {
				str = '申通快递';
			} else if (this.CompanyId === 5) {
				str = '圆通快递';
			} else if (this.CompanyId === 6) {
				str = '京东快递';
			}
			return str;
		},
		sentTime () {
			if (this.freightTime !== 0) {
				return dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(this.freightTime));
			}
		}
	},
	watch: {
		freightNo () {
			if (this.freightNo !== null) {
				this.showMsg = true;
			} else {
				this.showMsg = false;
			}
		}
	}
};
</script>