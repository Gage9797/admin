<template>
  <div id="course-index">
    <i-row :gutter="16">
      <i-col span="16">
        <i-card>
          <p slot="title">培训课程列表</p>
          <i-table :columns="tableColumns" :data="tableData"></i-table>
          <div style="text-align:center;margin-top:10px">
            <i-page :total="total" show-elevator @on-change="changePage"></i-page>
          </div>

        </i-card>
      </i-col>
      <i-col span="8">
        <i-card>
          <p slot="title">签到</p>
          <i-form :gutter="16" label-position="top" ref="form" :model="form" :rules="formRules">
            <i-form-item label="手机号码" prop="phone">
              <i-row :gutter="16">
                <i-col span="16">
                  <i-input type="text" v-model="form.phone"></i-input> 
                </i-col>
                <i-col span="8">
                  <i-button type="primary" @click="getSignInInfo">课程验证</i-button>
                </i-col>
              </i-row>
              
            </i-form-item>
            <i-form-item v-show="isGetCourseList" label="课程名称" prop="orderId">
              <i-select v-model="form.index" @change="changeSelect">
                <i-option v-for="(item, index) in courseList" :key="'orderId'+index" :value="index" :label="item.name"></i-option>
              </i-select>
            </i-form-item>
            <template v-if="form.index !== ''">
              <i-form-item label="开课时间">
                <i-input type="text" v-model="form.startTime" disabled></i-input>
              </i-form-item>
              <i-form-item label="开课茶馆">
                <i-input type="text" v-model="form.teaHouseName" disabled></i-input>
              </i-form-item>
            </template>     
          </i-form>
          <div style="text-align:center;margin-top:10px">
            <i-button type="primary" @click="signIn">签到</i-button>
          </div>
        </i-card>
      </i-col>
    </i-row>
  </div>
</template>

<script>
import dateTools from '../../tools/dateTools.js';
export default {
	name: 'courseIndex',
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),
			dic: {
				status: {
					'0': '未进行',
					'1': '进行中',
					'2': '已结束'
				}
			},
			tableColumns: [
				{title: '课程', key: 'name'},
				// {
				//   title: "状态",
				//   render: (h, params) => {
				//       return h('div', this.dic.status[params.row.status]);
				//   }
				// },
				{
					title: '开始时间',
					render: (h, params) => {
						return h('div', dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(params.row.start_time)));
					}
				},
				{title: '课程总人数', key: 'count'},
				{title: '已签到人数', key: 'signNum'},
				{
					title: '签到',
					render: (h, params) => {
						return h('div', params.row.signFlag ? '正在签到' : '签到已结束');
					}
				}
			],
			tableData: [],
			total: 0,
			form: {
				index: '',
				startTime: '',
				teaHouseName: ''
			},
			formRules: {},
			isGetCourseList: false,
			courseList: []
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
			me.$http.request(me, 'POST', '/train/courseList', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.total = data.result.total;
					me.tableData = data.result.list;
				} else {

				}
			});
		},
		getSignInInfo () {
			let me = this;
			let params = {
				phone: me.form.phone,
				teaHouseId: this.teaHouseId
			};
			me.$http.request(me, 'POST', '/train/signQuery', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.isGetCourseList = true;
					me.courseList = data.result;
				} else {

				}
			});
		},
		signIn () {
			let me = this;
			let params = {
				orderId: me.courseList[me.form.index].orderId,
				teaHouseId: this.teaHouseId
			};
			me.$http.request(me, 'POST', '/train/signIn', params, {contentType: 'application/x-www-form-urlencoded'}).then(function (response) {
				let data = response.data;
				if (data.errCode == '000000') {
					me.initSignIn();
				} else {

				}
			});
		},
		initSignIn () {
			this.form.index = '';
			this.isGetCourseList = false;
			this.courseList = [];
		},
		changeSelect () {
			this.form.startTime = this.courseList[this.form.index]['start_time'];
			this.form.teaHouseName = this.courseList[this.form.index]['teaHouseName'];
		}
	},
	created () {
		this.getList();
	}
};
</script>

<style lang="less">
</style>