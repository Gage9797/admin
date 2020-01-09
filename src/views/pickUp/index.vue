<template>
  <div id="pickUp-index">
    <i-row :gutter="16">
      <i-col span="16">
        <i-card>
          <p slot="title">已提货列表</p>
          <i-table :columns="tableColumns" :data="tableData"></i-table>
          <div style="text-algin:center;margin-top:10px;">
            <i-page :total="total" show-elevator @on-change="changePage"></i-page>
          </div>
        </i-card>
      </i-col>
      <i-col span="8">
        <i-card>
          <p slot="title">提货</p>
          <i-form :gutter="16" label-position="top" ref="form" :model="form" :rules="formRules">
            <i-form-item label="提货ID" prop="id">
              <i-input type="text" v-model="form.id"></i-input>
            </i-form-item>
            <i-form-item label="提取密码" prop="password">
              <i-row :gutter="16">
                <i-col span="16">
                  <i-input type="password" v-model="form.password" placeholder=""></i-input>
                </i-col>
                <i-col span="8">
                  <i-button type="primary" @click="verify">提货查询</i-button>
                </i-col>
              </i-row>
            </i-form-item>
            <template v-show="form.resultCode !== ''">
              <i-form-item label="查询结果" prop="result">
                <i-input type="text" v-model="form.result" disabled></i-input>
              </i-form-item>
              <i-form-item v-show="form.resultCode === '000000'" label="商品" prop="category">
                <i-input type="text" v-model="form.category" disabled></i-input>
              </i-form-item>
            </template>
          </i-form>
           <div style="text-align:center;margin-top:10px">
            <i-button type="default" @click="cancel">取消提货</i-button>
            <i-button :disabled="form.resultCode !== '000000'" type="primary" style="margin-left:10px;" @click="submit">确认提货</i-button>
          </div>
        </i-card>
      </i-col>
    </i-row>
  </div>
</template>

<script>
export default {
	name: 'pickUpIndex',
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),
			tableColumns: [
				{title: '商品名称', key: 'mallGood'},
				{
					title: '类别',
					render: (h, params) => {
						return h('div', params.row.parent_classify + '/' + params.row.classify);
					}
				},
				{title: '提货时间', key: 'timestamp'},
				{title: '提货券码', key: 'card_id'},
				{title: '验证状态', key: 'is_validate'}

			],
			tableData: [],
			total: 0,
			form: {
				id: '',
				password: '',
				category: '',
				result: '',
				resultCode: ''
			},
			formRules: {

			}
		};
	},
	methods: {
		changePage (index) {
			this.getList(index);
		},
		getList (page = 1) {
			let me = this;
			let params = {
				currentPage: page,
				pageSize: 10,
				teaHouseId: this.teaHouseId
			};
			me.$http.request(me, 'POST', '/online/orderList', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.tableData = data.result.list;
					me.total = data.result.total;
				} else {

				}
			});
		},
		verify () {
			let me = this;
			let params = {
				id: this.form.id,
				password: this.form.password,
				teaHouseId: this.teaHouseId
			};
			me.$http.request(me, 'POST', '/online/verify', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.form.resultCode = data.errCode;
					me.form.result = data.errMsg;
					me.form.category = data.result.parent_classify + '/' + data.result.classify + '/' + data.result.mallGood;
				} else {
					me.form.result = data.errMsg;
				}
			});
		},
		cancel () {
			this.form = {
				id: '',
				password: '',
				category: '',
				result: '',
				resultCode: ''
			};
		},
		submit () {
			let me = this;
			let params = {
				id: this.form.id,
				password: this.form.password,
				teaHouseId: this.teaHouseId
			};
			me.$http.request(me, 'POST', '/online/extractGoods', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.$Message.success('提货成功');
					me.cancel();
				} else {
					me.$Message.error(data.errMsg);
				}
			});
		}
	},
	created () {
		this.getList(1);
	}
};
</script>

<style lang="less">
</style>