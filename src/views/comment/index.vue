<template>
  <is-sit-version v-if="!canUse"/>
  <div v-else id="comment-index">
    <i-row :gutter="16">
      <i-col span="24">
        <i-card>
          <div style="height:36px;" slot="title">
            <div style="float:left;line-height:36px; font-size: 16px; color: rgb(107,92,67)">评论列表</div>
          </div>
          <i-table :columns="tableColumns" :data="tableData"></i-table>
          <i-page
            style="margin-top:10px;text-align: center;"
            :total="pageTotal"
            show-elevator
			:current.sync="current"
            @on-change="changePage"
          ></i-page>
        </i-card>
      </i-col>
    </i-row>
  </div>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';
import dateTools from '@/tools/dateTools.js';
export default {
	name: 'commentIndex',
	data () {
		return {
			teaHouseId: this.$util.getTeaHouseId(),
			tableColumns: [
				{ title: '客户', key: 'userName' },
				{ title: '评分', key: 'star' },
				{ title: '内容', key: 'comment' },
				{
					title: '时间',
					key: 'createTime',
					render: (h, params) => {
						return h(
							'div',
							dateTools.format(
								'yyyy-MM-dd hh:mm:ss',
								new Date(params.row.createTime)
							)
						);
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h(
								'Button',
								{
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.userEvaluateUpp(params);
										}
									}
								},
								'置顶'
							)
							// h(
							// 	'Button',
							// 	{
							// 		props: {
							// 			type: 'error',
							// 			size: 'small'
							// 		},
							// 		on: {
							// 			click: () => {
							// 				this.deleteUserEvaluate(params);
							// 			}
							// 		}
							// 	},
							// 	'删除'
							// )
						]);
					}
				}
			],
			tableData: [],
			pageTotal: 0,
			current: 1,
			canUse: true
		};
	},
	components: {
		IsSitVersion
	},
	created () {
		this.$store
			.dispatch('GetAppInfo')
			.then(({ canUse }) => {
				this.canUse = canUse;
				if (canUse) {
					this.getTableData();
				}
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		changePage (page) {
			this.getTableData(page);
		},
		getTableData (page = 1) {
			let me = this;
			let params = {
				teaHouseId: this.teaHouseId,
				currentPage: page,
				pageSize: '10'
			};
			this.$http
				.request(this, 'POST', '/userManage/userEvaluateList', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode == '000000') {
						me.tableData = res.result.list;
						me.pageTotal = res.result.total;
						me.current = page;
					} else {
						me.$Message.error({
							content: '[' + res.errCode + ']' + res.errMsg
						});
					}
				})
				.catch(function (error) {
					me.$Message.error({
						content: error
					});
				});
		},
		userEvaluateUpp (params) {
			let me = this;
			this.$Modal.confirm({
				title: '提示',
				loading: true,
				content: '是否置顶' + params.row.userName + '的评论?',
				onOk: function () {
					let httpParams = {
						evaluateId: params.row.id
					};
					me.$http
						.request(this, 'POST', '/userManage/userEvaluateUpp', httpParams)
						.then(function (response) {
							let res = response.data;
							if (res.errCode === '000000') {
								me.getTableData();
								me.$Modal.remove();
								me.$Message.success('操作成功');
							} else {
								me.$Modal.remove();
								me.$Message.error({
									content: '[' + res.errCode + ']' + res.errMsg
								});
							}
						})
						.catch(function (error) {});
				}
			});
		},
		deleteUserEvaluate (params) {
			let me = this;
			this.$Modal.confirm({
				title: '提示',
				loading: true,
				content: '是否删除' + params.row.userName + '的评论?',
				onOk: function () {
					let httpParams = {
						evaluateId: params.row.id
					};
					me.$http
						.request(this, 'POST', '/userManage/deleteUserEvaluate', httpParams)
						.then(function (response) {
							let res = response.data;
							if (res.errCode == '000000') {
								me.getTableData();
								me.$Modal.remove();
								me.$Message.success('操作成功');
							} else {
								me.$Modal.remove();
								me.$Message.error({
									content: '[' + res.errCode + ']' + res.errMsg
								});
							}
						})
						.catch(function (error) {});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
/deep/ .ivu-card {
  background: rgb(228, 228, 226);
  border-radius: 16px;
}
/deep/ .ivu-card-head {
  border-bottom: 1px solid rgb(160, 160, 160);
  margin: 0 20px;
}
</style>
