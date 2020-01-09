<style lang="less" scoped>
.question-title{
    font-size: 14px;
    color: black;
}
.question-content{
    margin-left: 13px;
}
</style>

<template>
    <div>
        <!-- 单项选择题 -->
        <div v-if="type == 1">
            <div class="question-title">{{ index+1 }}.{{ questionTitle }}</div>
            <div class="question-content">
                <RadioGroup v-model="radioAns[0]" @on-change="radioAnsChange">
                    <Radio v-for="item in option" :key="item.id" :label="item" style="display:block;"></Radio>
                </RadioGroup>
            </div>
        </div>
        <!-- 多项选择题 -->
        <div v-else-if="type == 2">
            <div class="question-title">{{ index+1 }}.{{ questionTitle }}</div>
            <div class="question-content">
                <CheckboxGroup v-model="checkboxAns" @on-change="checkboxAnsChange">
                    <Checkbox v-for="item in option" :key="item.id" :label="item" style="display:block;"></Checkbox>
                </CheckboxGroup>
            </div>
        </div>
        <!-- 填空题 -->
        <div v-else-if="type == 3">
            <div class="question-title">{{ index+1 }}.{{ questionTitle }}</div>
            <div class="question-content">
                <Input
                    v-model="inputAns[0]"
                    type="textarea"
                    placeholder="Enter something..."
                    @on-change="inputAnsChange"
                    style="width:85%;"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'each-question',
	props: {
		type: Number,
		questionTitle: String,
		option: Array,
		questionID: Number,
		answer: Object,
		index: Number
	},
	data () {
		return {
			radioAns: [],
			checkboxAns: [],
			inputAns: [],
			qID: this.questionID
		};
	},
	methods: {
		radioAnsChange () {
			this.$emit('change-ans', this.radioAns, this.index);
		},
		checkboxAnsChange () {
			this.$emit('change-ans', this.checkboxAns, this.index);
		},
		inputAnsChange () {
			this.$emit('change-ans', this.inputAns, this.index);
		}
	}
};
</script>