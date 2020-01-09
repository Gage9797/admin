<style lang="less" scoped>
.notice-bar {
	position: relative;
	min-width: 640px;
	height: 22px;
	padding-left: 44px;
	font-size: 10px;
	line-height: 22px;
	background-color: #e8c66b;

	&-close {
		position: absolute;
		right: 0;
		top: 0;
		padding: 0 18px;
		cursor: pointer;
	}

	&-content {
		display: inline-block;
	}

	.highlight {
		cursor: pointer;
		color: #1996de;
	}
}
</style>

<template>
	<div id="notice-bar" class="notice-bar" v-show="ifShow">
		<div>
			<Icon type="volume-medium" size="10" style="margin-right: 6px;"></Icon>
			<div class="notice-bar-content">
				<!-- 试用期，未过期，未填写问卷，字符串标记为 000 -->
				<template v-if="isType === '000'">你所申请的智慧管家系统还有 {{ restTime }} 天到期，可点击
					<span class="highlight" @click="toFillOutQuestionnaire">参与问卷>>></span> 延长试用期或
					<span class="highlight" @click="toLocate">正式入驻>>></span> 体验智慧管家一站式新零售服务!
				</template>

				<!-- 试用期，未过期，已经填写问卷，字符串标记为 001 -->
				<template v-else-if="isType === '001'">你所申请的智慧管家系统还有 {{ restTime }} 天到期，可点击
					<span class="highlight" @click="toLocate">正式入驻>>></span> 体验智慧管家一站式新零售服务!
				</template>

				<!-- 试用期，过期，未填写问卷，字符串标记为 010 -->
				<template v-else-if="isType === '010'">你所申请的智慧管家系统使用体验已到期，可点击
					<span class="highlight" @click="toFillOutQuestionnaire">参与问卷>>></span> 延长试用期或
					<span class="highlight" @click="toLocate">正式入驻>>></span> 体验智慧管家一站式新零售服务!
				</template>

				<!-- 试用期，过期，已经填写问卷，字符串标记为 011 -->
				<template v-else-if="isType === '011'">你所申请的智慧管家系统使用体验已到期，可点击
					<span class="highlight" @click="toLocate">正式入驻>>></span> 体验智慧管家一站式新零售服务!
				</template>

				<!-- 审核阶段，字符串标记为 100 -->
				<template v-else-if="isType === '100'">
					你所申请的智慧管家系统处于审核阶段，请耐心等候。
				</template>

				<!-- 已入驻，倒计时提醒，字符串标记为 200 -->
				<template v-else-if="isType === '200'">你所购买的智慧管家系统还有 {{ restTime }} 天到期，可点击
					<span class="highlight" @click="toRenew">在线续费>>></span> 继续体验智慧管家一站式新零售服务!
				</template>

				<!-- 已入驻，已过期，字符串标记为 210 -->
				<template v-else-if="isType === '210'">你所购买的智慧管家系统服务已到期，可点击
					<span class="highlight" @click="toRenew">在线续费>>></span> 继续体验智慧管家一站式新零售服务!
				</template>
			</div>

		</div>
		<div class="notice-bar-close" @click="ifShow = false">
			<Icon type="android-close" size="10"></Icon>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'noticeBar',
	data () {
		return {
			ifShow: true
			// resetTime: 0,
			// isType: ''
		};
	},
	computed: {
		...mapGetters([
			'appVersion',
			'restTime',
			'questionnaire'
		]),
		isAdmin () {
			return this.$store.state.user.isAdmin;
		},
		restTime () {
			return this.$store.state.user.restTime;
		},
		isType () {
			let flag = '';
			let isType = '';
			const { appVersion, restTime, questionnaire } = this;

			if (appVersion === 2) {
				// 1、2、 3 =>试用、审核、入驻
				// questionnaire true-> 已填 -> 1
				isType = '100';
			} else if (appVersion === 1) {
				flag += '0';
				flag += restTime < 0 ? '1' : '0';
				flag += questionnaire ? '1' : '0';
				isType = flag;
			} else {
				if (restTime > 30) {
					this.ifShow = false;
				} else if (restTime >= 0) {
					isType = '200';
				} else {
					isType = '210';
				}
			}
			return isType;
		}
	},
	created () {
		// this.$store.dispatch('GetAppInfo')
		// 	.then(({ appVersion, restTime, questionnaire }) => {
		// 		this.setType(appVersion, restTime, questionnaire);
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	},
	methods: {
		setType (appVersion, restTime, questionnaire) {
			let flag = '';
			if (appVersion === 2) {
				// 1、2、 3 =>试用、审核、入驻
				// questionnaire true-> 已填 -> 1
				this.isType = '100';
			} else if (appVersion === 1) {
				flag += '0';
				flag += restTime < 0 ? '1' : '0';
				flag += questionnaire ? '1' : '0';
				this.isType = flag;
			} else {
				if (restTime > 30) {
					this.ifShow = false;
				} else if (restTime >= 0) {
					this.isType = '200';
				} else {
					this.isType = '210';
				}
			}
		},
		goHandler (routerOption) {
			// 校验是否为admin
			if (!this.isAdmin) {
				this.$router.push({
					name: 'notAdmin'
				});
			} else {
				this.$router.push(routerOption);
			}
		},
		toFillOutQuestionnaire () {
			this.$router.push({
				name: 'questionnaire'
			});
		},
		toLocate () {
			this.goHandler({
				name: 'locateHouseInfo'
			});
		},
		toRenew () {
			this.goHandler({
				name: 'renew'
			});
		}
	}
};
</script>
