<style lang="less" scoped>
.select-wrap {
//   position: absolute;
//   top: 50px;
//   left: 20px;
//   width: 95%;
//   padding-top: 10px;
  border-bottom: 1px solid rgb(210,210,210);
}
.ctrl-bar{
	position: relative;

	main {
		position: relative;
		margin-top: -10px;
		padding: 0 20px;
		background-color: #e4e4e2;
	}
}
.page {
	padding-top: 10px;
	text-align: center;
}
/deep/ .ivu-spin-fix {
	display: block;
}

.spin-icon-load{
	animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
	from { transform: rotate(0deg);}
	50%  { transform: rotate(180deg);}
	to   { transform: rotate(360deg);}
}

/deep/ .ivu-table td{
    background: rgb(235,235,233);
    border-bottom: 1px solid rgb(210,210,210)
}
/deep/ .ivu-table th{
    background: rgb(235,235,233);
    border-bottom: 1px solid rgb(210,210,210);
    color: rgb(107,92,67)
}
/deep/ .ivu-input{
  background:rgb(235,235,233);
}
/deep/ .ivu-select-selection{
  background:rgb(235,235,233);
}
/deep/ .ivu-form-item-label{
  color: rgb(127,128,123);
  font-size: 14px;
}
</style>

<template>
	<div id="order-index">
    	<div class="ctrl-bar">
			<Tabs type="card" v-model="listQueryOption.status">
				<TabPane label="全 部"  name="2" class="ql-tab-pane">

				</TabPane>
				<TabPane label="消费中"  name="1"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
				<TabPane label="已结账"  name="0"  class="ql-tab-pane">
					<!-- <Table border :columns="columns" :data="list" class="order-table"></Table> -->
				</TabPane>
			</Tabs>

			<main>
				<div class="select-wrap">
					<i-form label-position="right" :label-width="85" class="i-form">
						<i-row>
							<i-col span="8">
								<i-form-item label="订单时间：">
									<i-date-picker type="daterange" v-model="daterange" style="width:100%" :editable="false"></i-date-picker>
								</i-form-item>
							</i-col>
							<i-col span="5">
								<i-form-item label="类型：">
									<i-select v-model="roomOrTable">
										<i-option value="0">全部</i-option>
										<i-option value="1">包间</i-option>
										<i-option value="2">散座</i-option>
									</i-select>
								</i-form-item>
							</i-col>
							<i-col span="7">
								<i-form-item label="桌台：">
									<i-select v-model="roomOrTableKey">
										<i-option :value="0">全部</i-option>
										<i-option v-for="rt in roomOrTableList" :key="rt.key" :value="rt.key">{{ rt.name }}</i-option>
									</i-select>
								</i-form-item>
							</i-col>
							<i-col span="2" offset="1">
								<i-button type="primary" @click="search">查询</i-button>
							</i-col>
						</i-row>
					</i-form>
				</div>
				<div class="table-wrapper">
					<Table border :columns="columns" :data="list" class="order-table"></Table>

					<Spin fix v-show="isTableLoading">
						<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
						<div>Loading</div>
					</Spin>
				</div>
			</main>

			<div class="page">
				<Page :total="totalPages" :current.sync="listQueryOption.currentPage" :page-size="listQueryOption.pageSize" @on-change="pageNumChange"/>
			</div>
		</div>


		<Modal
			v-model="modalOfPayConfirm"
			title="确认结账"
			@on-ok="modalOk">
		<p v-html="modalConfirmMsg"></p>
		</Modal>
	</div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import mixins from './mixins';

export default {
	name: 'order',
	mixins: [mixins],
	data () {
		return {
			totalPages: 1,
			listQueryOption: {
				status: '2', // 订单状态（1-进行中，2-全部）
				currentPage: 1,
				pageSize: 10,
				queryCondition: {
					roomIdArray: [],
					tableIdArray: [],
					beginDate: dateTools.format('yyyy-MM-dd', new Date(Date.now() - 30 * 24 * 3600 * 1000)),
					endDate: dateTools.format('yyyy-MM-dd', new Date())
				}
			},
			daterange: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()],
			roomOrTable: '0',

			list: [],
			roomList: [],
			teaTableList: [],
			roomOrTableKey: 0,

			modalOfPayConfirm: false,
			modalConfirmMsg: '',
			isPaymentConfirmNeeded: null,
			isTableLoading: false
		};
	},
	computed: {
		roomOrTableList () {
			let roomOrTable = parseInt(this.roomOrTable);
			this.roomOrTableKey = 0;
			if (roomOrTable === 0) { // all
				// return this.roomList.concat(this.teaTableList);
				return [].concat(this.roomList, this.teaTableList);
			} else if (roomOrTable === 1) { // room
				return this.roomList;
			} else {
				return this.teaTableList;
			}
		}
	},
	methods: {
		showDetail (row) {
			this.$router.push({
				name: 'order_detail',
				query: {
					orderId: row.orderId,	// 奇葩的命名。
					payway: row.payway
				},
				params: {
					orderId: row.orderId
				}
			});
		},
		getListData () {
			this.isTableLoading = true;
			return new Promise((resolve, reject) => {
				this.$http.request(this, 'POST', '/teaOrder/getTeaOrderList', this.listQueryOption)
					.then(res => {
						this.isTableLoading = false;
						if (res.data.errCode === '000000') {
							// const RESULT = res.data.result;
							// this.totalPages = RESULT.total;
							this.list = res.data.data.orderList;
							console.log('list', this.list);
						}
						// return new Promise((resolve, reject) => {
						// });
						resolve(this.list);
					})
					.catch(e => {
						console.log(e);
						this.isTableLoading = false;
					});
			});
		},
		hasChanged (n) {
			n = JSON.stringify(n);
			if (this.oldDataStr === n) {
				return false;
			}
			this.oldDataStr = n;
			return true;
		},
		search () {
			// let lqo = this.listQueryOption;
			// if (this.daterange.length && this.daterange[0] !== null) {
			// 	lqo.queryCondition.beginDate = dateTools.format('yyyy-MM-dd', this.daterange[0]);
			// 	lqo.queryCondition.endDate = dateTools.format('yyyy-MM-dd', this.daterange[1]);
			// } else {
			// 	lqo.queryCondition.beginDate = dateTools.format('yyyy-MM-dd', new Date(Date.now() - 30 * 24 * 3600 * 1000)); // 30 days
			// 	lqo.queryCondition.endDate = dateTools.format('yyyy-MM-dd', new Date());
			// }

			/**
			 * 需求修改：类型为全部时，桌台显示全部。那么，需要根据key的前缀做区分。
			 */

			// const ROOM_OR_TABLE = parseInt(this.roomOrTable);		// 类型值
			// const ROOM_OR_TABLE_KEY = this.roomOrTableKey;	// 某个 包间 或者 桌台的 id，当为 0 时，表示为全部

			// if (ROOM_OR_TABLE_KEY === 0) {
			// 	// 桌台处 为 全部

			// 	if (ROOM_OR_TABLE === 0) {
			// 		// 类型也为 全部 时
			// 		lqo.queryCondition.roomIdArray = []; // 空表示查询所有
			// 		lqo.queryCondition.tableIdArray = []; // 空表示查询所有
			// 	} else if (ROOM_OR_TABLE === 1) {
			// 		// 查询所有 包间
			// 		lqo.queryCondition.roomIdArray = this.roomOrTableList.map(x => x.id); // 查询所有包间
			// 		lqo.queryCondition.tableIdArray = [];
			// 	} else {
			// 		// 查询所有 散座
			// 		lqo.queryCondition.roomIdArray = [];
			// 		lqo.queryCondition.tableIdArray = this.roomOrTableList.map(x => x.id);
			// 	}
			// } else if (ROOM_OR_TABLE_KEY.startsWith('r_')) {
			// 	// 具体的包间
			// 	lqo.queryCondition.roomIdArray = [Number(ROOM_OR_TABLE_KEY.slice(2))];
			// 	lqo.queryCondition.tableIdArray = [];
			// } else {
			// 	// 具体的散座
			// 	lqo.queryCondition.roomIdArray = [];
			// 	lqo.queryCondition.tableIdArray = [Number(ROOM_OR_TABLE_KEY.slice(2))];
			// }

			// if (ROOM_OR_TABLE === 0) {
			// 	// 类型为 全部 时
			// 	lqo.queryCondition.roomIdArray = []; // 空表示查询所有
			// 	lqo.queryCondition.tableIdArray = []; // 空表示查询所有
			// } else if (ROOM_OR_TABLE === 1) {
			// 	// 类型为 包间 时
			// 	if (ROOM_OR_TABLE_ID) {
			// 		lqo.queryCondition.roomIdArray = [ROOM_OR_TABLE_ID]; // 查询某个包间
			// 	} else {
			// 		lqo.queryCondition.roomIdArray = this.roomOrTableList.map(x => x.id); // 查询所有包间
			// 	}
			// 	lqo.queryCondition.tableIdArray = [];
			// } else {
			// 	// 类型为 桌台 时
			// 	if (ROOM_OR_TABLE_ID) {
			// 		lqo.queryCondition.tableIdArray = [ROOM_OR_TABLE_ID];
			// 	} else {
			// 		lqo.queryCondition.tableIdArray = this.roomOrTableList.map(x => x.id);
			// 	}
			// 	lqo.queryCondition.roomIdArray = [];
			// }
			this.getListData().then(res => {
				let list = [];
				if (this.roomOrTable === '1') {
					this.list.forEach((item, index) => {
						if (item.name.indexOf('包间') !== -1) {
							console.log('item', item);
							list.push(item);
						}
					});
				} else if (this.roomOrTable === '2') {
					this.list.forEach((item, index) => {
						if (item.name.indexOf('散座') !== -1) {
							list.push(item);
						}
					});
				} else {
					list = res;
					console.log('this.list', res);
				}
				this.list = list;
			});
		},
		pageNumChange (num) {
			this.listQueryOption.currentPage = num;
			this.getListData();
		},
		pay (index) {
			const pillData = this.data[index];
			let id = pillData.id;

			this.$http
				.request(this, 'POST', '/teaOrder/getPayment', {
					orderKeyId: id
				})
				.then(res => {
					let data = res.data;
					let result = data.result;
					if (data.errCode === '000000') {
						this.modalOfPayConfirm = true;
						if (result.isPaid) {
							this.modalConfirmMsg = '用户已线上结账';
							this.isPaymentConfirmNeeded = {
								ifNeed: false
							};
						} else {
							this.modalConfirmMsg = `订单金额 ￥ <span style="color: red;">${
								result.payment
							}</span> 元，请收到用户结账金额后确定。`;
							this.isPaymentConfirmNeeded = {
								ifNeed: true,
								data: {
									orderKeyId: id,
									payment: result.payment,
									totalPrice: result.totalFee
								}
							};
						}
					}
				})
				.catch(err => {
					console.error(err);
					this.$Message.info('出现故障了');
				});
		},
		modalOk () {
			if (this.isPaymentConfirmNeeded.ifNeed) {
				this.$http
					.request(
						this,
						'POST',
						'/teaOrder/payTheBill',
						this.isPaymentConfirmNeeded.data
					)
					.then(res => {
						if (res.data.errCode === '000000') {
							console.log(res);
						} else {
							this.$Message.error('确认结账失败');
						}
					})
					.catch(err => {
						this.$Message.info('确认结账失败');
					});
			}
		}
	},
	created () {
		this.getListData();

		// const ROOM_LIST = this.roomList;
		// const TEA_TABLE_LIST = this.teaTableList;
		// const teaHouseId = this.$util.getTeaHouseId();
		// this.$http.request(this, 'GET', '/teaTable/getTeaTableList?teaHouseId=' + teaHouseId)
		// 	.then(res => {
		// 		if (res.data.errCode === '000000') {
		// 			let result = res.data.result;
		// 			result.roomList.forEach((i, index) => {
		// 				ROOM_LIST.push(
		// 					Object.assign(i, {
		// 						key: 'r_' + i.id
		// 					})
		// 				);
		// 			});
		// 			result.teaTableList.forEach((i, index) => {
		// 				TEA_TABLE_LIST.push(
		// 					Object.assign(i, {
		// 						key: 't_' + i.id
		// 					})
		// 				);
		// 			});
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	},
	activated () {
		// console.log(this.$route);
		if (!this.$route.query.cached) {
			// sj：如果是从其他地方回到本页面，那就要使用默认条件查询啊！
			this.listQueryOption = {
				status: '2', // 订单状态（1-进行中，2-全部）
				currentPage: 1,
				pageSize: 10,
				queryCondition: {
					roomIdArray: [],
					tableIdArray: [],
					beginDate: dateTools.format('yyyy-MM-dd', new Date(Date.now() - 30 * 24 * 3600 * 1000)),
					endDate: dateTools.format('yyyy-MM-dd', new Date())
				}
			};
			this.daterange = [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()];
			this.roomOrTable = '0';
			this.roomOrTableKey = 0;
			this.getListData();
		} else {
			// sj: 保留查询条件，列表要刷新啊。。。
			this.getListData();
		}
	},
	watch: {
		'listQueryOption.status': function (v) {
			this.listQueryOption.currentPage = 1;
			this.getListData().then(res => {
				console.log('v', v);
				let list = [];
				if (v === '0') {
					this.list.forEach((item, index) => {
						if (item.state === '0') {
							console.log('item', item);
							list.push(item);
						}
					});
				}
				if (v === '1') {
					this.list.forEach((item, index) => {
						if (item.state === '1') {
							list.push(item);
						}
					});
				} else {
					list = res;
					console.log('this.list', res);
				}
				this.list = list;
			});
		}
	}
};
</script>

