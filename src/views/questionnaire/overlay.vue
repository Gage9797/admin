<style lang="less" scoped>
.questionnaire-overlay {
	box-sizing: border-box;
	width: 56px;
	height: 56px;
	padding: 10px 0;
	border-radius: 50%;
	text-align: center;
	border: 1px solid #fff;
	background-color: #e8c66b;
	cursor: pointer;
}
</style>

<template>
	<div id="questionnaire-overlay" class="questionnaire-overlay" v-show="ifShow">
		<Poptip trigger="hover" title="" content="点击填写问卷">
			<Icon type="edit" size="36" color="#f3f3f3" @click.native="toFillOutQuestionaire"></Icon>
		</Poptip>
	</div>
</template>

<script>
export default {
	name: 'questionnaireOverlay',
	data () {
		return {
			ifShow: false
		};
	},
	computed: {
		isAdmin () {
			return true;
		}
	},
	created () {
		this.$store.dispatch('GetAppInfo')
			.then(({ appVersion, questionnaire }) => {
				if (appVersion === 3) {
					// 1、2、 3 =>试用、审核、入驻
					this.ifShow = false;
				} else {
					this.ifShow = !questionnaire;
				}
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		toFillOutQuestionaire () {
			if (!this.isAdmin) {
				this.$router.push({
					name: 'notAdmin'
				});
			} else {
				this.$router.push({
					name: 'questionnaire'
				});
			}
		}
	},
	watch: {
		'$route': function (newRoter) {
			if (newRoter.name === 'questionnaire') {
				this.ifShow = false;
			}
		}
	}
};
</script>
