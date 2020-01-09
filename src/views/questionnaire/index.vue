<style lang="less" scoped>
.page-header {
    margin: auto;
    text-align: center;
    font-size: 25px;
    color: #2a2a2a;
    padding: 15px 0;
    border-bottom: 2px solid #888888;
}

.page-content {
    margin-top: 30px;
}

.question {
    color: #2a2a2a;
    font-size: 20px;
}

.questionnaire-intro{
	margin-top: 15px;
	font-size: 16px;
}

.btn-line {
    margin: auto;
    text-align: center;
}
</style>

<template>
    <div class="single-page">
        <div class="page-header">{{ questionnaireTitle }}</div>
		<div class="questionnaire-intro">{{ questionnaireState }}</div>
        <div class="page-content">
            <Form>
                <FormItem v-for="(item, index) in questionList" :key="item.id">
					<each-question
                        :questionTitle="item.question"
                        :type="item.type"
                        :option="item.option"
                        :questionID="item.questionID"
                        :answer="answerList[index]"
						:index="index"
                        @change-ans="updateAns"
                    />
                </FormItem>
                <FormItem class="btn-line">
                    <Button @click="submitAns">提交问卷</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import eachQuestion from './components/each-question.vue';

export default {
	components: {
		eachQuestion
	},
	data () {
		return {
			questionnaireID: null,
			questionnaireState: null,
			questionnaireTitle: null,
			questionList: [],
			answerList: [],
			paramsError: ''
		};
	},
	created () {
		this.getInfo();
	},
	methods: {
		getInfo () {
			this.$request.post('/questionnaire/getinfo')
				.then(res => {
					if (res.errCode === '000000') {
						this.questionnaireID = res.result.questionnaireID;
						this.questionnaireState = res.result.questionnaireState;
						this.questionnaireTitle = res.result.questionnaireTitle;
						this.questionList = res.result.questionList;
						for (var i = 0; i < this.questionList.length; i++) {
							let temp = {
								questionID: i,
								answer: null
							};
							this.answerList.push(temp);
						}
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					this.$Message.error(err.message);
					console.log(err);
				});
		},
		updateAns (ans, index) {
			this.answerList[index].answer = ans;
		},
		submitAns () {
			let params = {
				answerList: this.answerList,
				questionnaireID: this.questionnaireID
			};
			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$request.post('/questionnaire/postAnswer', params)
				.then(res => {
					if (res.errCode === '000000') {
						this.$store.dispatch('GetUserInfo')
							.then(() => {
								// this.$router.push({
								// 	name: 'home_index'
								// });
								this.$router.go(-1);
							});
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					this.$Message.error(err.message);
					console.log(err);
				});
		},
		checkParams (p) {
			for (var i = 0; i < p.answerList.length; i++) {
				if (this.isEmpty(p.answerList[i].answer)) {
					let temp = i + 1;
					this.paramsError = '问题' + temp + '不能为空';
					return false;
				}
			}
			return true;
		},
		isEmpty (value) {
			if (value === null) {
				return true;
			}
		}
	}
};
</script>
