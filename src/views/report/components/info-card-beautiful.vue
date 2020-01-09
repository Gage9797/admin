<style lang="less">
.infor-card-icon-con{
    height: 100%;
}
.height-100{
    height: 100%;
}
.infor-card-con{
    height: 100px;
}
.infor-intro-text{
    font-size:12px;
    font-weight:500;
    color:#C8C8C8;
}
</style>

<template>
    <i-card :padding="0">
        <div class="infor-card-con">
            <i-col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
                <i-row class="height-100" type="flex" align="middle" justify="center">
                    <i-icon :type="iconType" :size="iconSize"></i-icon>
                </i-row>
            </i-col>
            <i-col span="16" class="height-100">
                <i-row type="flex" align="middle" justify="center" class="height-100">
                    <count-up 
                        class="infor-card-count user-created-count" 
                        :id-name="idName" 
                        :end-val="endVal" 
                        :color="color"
                        :countSize="countSize"
                        :countWeight="countWeight"
                    >
                        <p class="infor-intro-text" slot="intro">{{ introText }}</p>
                    </count-up>
                </i-row>
            </i-col>
        </div>
    </i-card>
</template>

<script>
import countUp from './count-up.vue';

export default {
	name: 'infoCard',
	components: {
		countUp
	},
	props: {
		idName: String,
		endVal: Number,
		color: String,
		iconType: String,
		introText: String,
		countSize: {
			type: String,
			default: '30px'
		},
		countWeight: {
			type: Number,
			default: 700
		},
		iconSize: {
			type: Number,
			default: 40
		}
	}
};
</script>

