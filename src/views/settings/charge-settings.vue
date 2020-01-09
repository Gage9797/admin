<template>
  <div id="charge-list">
    <div class="top-bar">
      <div class="left">
        计费规则列表
      </div>
      <div class="right">
        <Button
          type="success"
          @click="editNewRule">
          新增计费方式
        </Button>
      </div>
    </div>
    <div class="content">
      <Table :columns="rulesColumns" :data="rulesData" />
    </div>
    <!--规则编辑弹框-->
    <Modal
      v-model="showRuleDetail"
      :title="modelTitle"
      @on-ok="addOrModify"
      >
      <Form :label-width="80">
        <FormItem label="计费名称">
          <Input v-model="currentRule.name" placeholder="计费名称" :maxlength="20" />
        </FormItem>
        <FormItem label="计费方式">
          <Select v-model="currentRule.wayStr">
            <Option value="按小时">按小时计费</Option>
            <Option value="按茶位">按茶位计费</Option>
            <Option value="按包断">按包断时长计费</Option>
          </Select>
        </FormItem>
        <FormItem label="计费规则">
          <div v-if="currentRule.wayStr === '按小时'">
            每小时收费
            <InputNumber2
				v-model="currentRule.per"
				:min="0"
				:max="655360"
				:precision="2"
				class="number-input"
            />
            元
          </div>
          <div v-if="currentRule.wayStr === '按茶位'">
            每个茶位收费
            <InputNumber2
              	v-model="currentRule.fee"
				:min="0"
			  	:max="655360"
				  :precision="2"
              	class="number-input"
            />
            元
          </div>
          <div v-if="currentRule.wayStr === '按包断'">
            每
            <InputNumber
				v-model="currentRule.length"
				:min="1"
				:max="655360"
				:precision="0"
				class="number-input"
            />
            个小时，费用
            <InputNumber2
              	v-model="currentRule.charge"
			  	:min="0"
			  	:max="655360"
				  :precision="2"
              	class="number-input"
            />
            元
          </div>
        </FormItem>
      </Form>
	  <div slot="footer">
   			<Button type="text" @click="showRuleDetail = false">取消</Button>
            <Button type="primary" @click="addOrModify">确定</Button>
	  </div>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
#charge-list {
  background: #e4e4e2;
  border-radius: 10px;
  padding: 10px;
  .top-bar {
    height: 45px;
    border-bottom: 1px solid #d8d8d6;
    line-height: 45px;
    .left {
      float: left;
      font-size: 20px;
      color: #7b7256;
    }
    .right {
      float: right;
    }
  }
  .content {
    margin-top: 15px;
  }
}
.number-input {
  height: 30px;
  width: 100px;
  border: 1px solid #ddd;
  border-radius: 3px;
  text-indent: 5px;
  outline: none;
}
</style>

<script>
import InputNumber2 from '@/components/input-number';
import { formatPrice } from '@/tools';

export default {
	name: 'charge_settings',
	components: {
		InputNumber2
	},
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),
			showRuleDetail: false,
			currentRule: {
				name: '',
				wayStr: '按小时',
				per: 0,
				fee: 0,
				length: 1,
				charge: 0
			},
			rulesColumns: [
				{ title: '计费名称', key: 'name' },
				{ title: '计费方式', key: 'wayStr' },
				{ title: '每小时费用', key: 'perStr', render: (h, params) => h('div', formatPrice(params.row.perStr)) },
				{ title: '茶位费', key: 'feeStr', render: (h, params) => h('div', formatPrice(params.row.feeStr)) },
				{ title: '包断时长', key: 'lengthStr' },
				{ title: '包断费用', key: 'chargeStr', render: (h, params) => h('div', formatPrice(params.row.chargeStr)) },
				{ title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.modelTitle = '编辑计费规则';
										this.showRule(params.row);
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.confirmDelete(params.row);
									}
								}
							}, '删除')
						]);
					}
				}
			],
			rulesData: [],
			modelTitle: '编辑计费规则'
		};
	},
	methods: {
		// 展示表格的数据格式化
		dataFormat (data) {
			data.map((ele) => {
				if (ele.way == 1) {
					ele.wayStr = '按小时';
				} else if (ele.way == 2) {
					ele.wayStr = '按茶位';
				} else {
					ele.wayStr = '按包断';
				}
				if (ele.per == 0) {
					ele.perStr = '';
				} else {
					ele.perStr = ele.per;
				}
				if (ele.fee == 0) {
					ele.feeStr = '';
				} else {
					ele.feeStr = ele.fee;
				}
				if (ele.length == 0) {
					ele.lengthStr = '';
				} else {
					ele.lengthStr = ele.length;
				}
				if (ele.charge == 0) {
					ele.chargeStr = '';
				} else {
					ele.chargeStr = ele.charge;
				}
			});
			return data;
		},
		// 获取计费规则列表
		getrulesData () {
			let me = this;
			let params = {
				teaHouseId: this.teaHouseId
			};
			this.$http.request(this, 'POST', '/settings/rules/list', params).then(function (response) {
				let res = response.data;
				if (res.errCode === '000000') {
					me.rulesData = me.dataFormat(res.result.staffList).reverse();
				}
			}).catch(function (error) {
				console.log(error);
				me.$Message.error({
					content: '请求失败！'
				});
			});
		},
		// 删除计费规则
		deleteRule (id) {
			let me = this;
			let params = {
				id: id
			};
			this.$http.request(this, 'POST', '/settings/rules/delete', params).then(function (response) {
				let res = response.data;
				if (res.errCode == '000000') {
					me.getrulesData();
				} else {
					me.$Message.error({
						content: res.errMsg
					});
				}
			}).catch(function (error) {
			});
		},
		// 删除确认弹出层
		confirmDelete (param) {
			this.$Modal.confirm({
				title: '删除确认',
				content: `<p>确定删除计费规则： ${param.name} 吗？</p>`,
				onOk: () => {
					this.deleteRule(param.id);
				}
			});
		},
		// 显示计费规则详情
		showRule (param) {
			this.currentRule = Object.assign({}, param);
			this.showRuleDetail = true;
		},
		// 分流修改和新增
		addOrModify () {
			if (this.currentRule.id) {
				this.modifyRule();
			} else {
				this.addNewRule();
			}
		},
		// 提交到后端的表单数据的格式化
		formFormat (rule) {
			let wayMap = {
				'按小时': 1,
				'按茶位': 2,
				'按包断': 3
			};
			rule.way = wayMap[rule.wayStr];
			if (rule.way == 1) {
				rule.per = parseInt(rule.per);
				rule.fee = 0;
				rule.length = 0;
				rule.charge = 0;
			} else if (rule.way == 2) {
				rule.fee = parseInt(rule.fee);
				rule.per = 0;
				rule.length = 0;
				rule.charge = 0;
			} else {
				rule.per = 0;
				rule.fee = 0;
				rule.length = parseInt(rule.length);
				rule.charge = parseInt(rule.charge);
			}
			return rule;
		},
		// 修改计费规则
		modifyRule (param) {
			let rule = this.formFormat(this.currentRule);

			if (rule.name.trim() === '') {
				return this.$Message.error('计费名称不可为空');
			}

			let me = this;
			let params = {
				id: rule.id,
				name: rule.name,
				way: rule.way,
				per: rule.per,
				fee: rule.fee,
				length: rule.length,
				charge: rule.charge
			};
			this.$http.request(this, 'POST', '/settings/rules/modify', params).then(function (response) {
				let res = response.data;
				if (res.errCode == '000000') {
					me.showRuleDetail = false;
					me.getrulesData();
				} else {
					me.$Message.error({
						content: '[' + res.errCode + ']' + res.errMsg
					});
				}
			}).catch(function (error) {
			});
		},
		// 编辑新增规则
		editNewRule () {
			this.modelTitle = '新增计费规则';
			this.currentRule = {
				name: '',
				wayStr: '按小时',
				per: 0,
				fee: 0,
				length: 1,
				charge: 0
			};
			this.showRuleDetail = true;
		},
		// 新增规则
		addNewRule () {
			let rule = this.formFormat(this.currentRule);

			if (rule.name.trim() === '') {
				return this.$Message.error('计费名称不可为空');
			}

			let me = this;
			let params = {
				teaHouseId: this.teaHouseId,
				name: rule.name,
				way: rule.way,
				per: rule.per,
				fee: rule.fee,
				length: rule.length,
				charge: rule.charge
			};
			this.$http.request(this, 'POST', '/settings/rules/add', params).then(function (response) {
				let res = response.data;
				if (res.errCode === '000000') {
					me.showRuleDetail = false;
					me.getrulesData();
				} else {
					me.$Message.error({
						content: res.errMsg
					});
				}
			}).catch(function (error) {
			});
		}
	},
	mounted () {
		this.getrulesData();
	}
};
</script>
