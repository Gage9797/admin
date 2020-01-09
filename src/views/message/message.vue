<style lang="less">
@import "./message.less";

.msg-control {
	display: flex;
	justify-content: space-between;
	padding: 8px 20px;
	background-color: #ebebe9;

	&-type-select {
		width: 100px;
	}
}

.page-wrapper {
	padding: 10px;
	text-align: center;
	background-color: #ebebe9;
}
.has-read {
	color: #b5aeae;
}

.spin-icon-load {
	animation: ani-spin 1s linear infinite;
}

@keyframes ani-spin {
	from { transform: rotate(0deg); }
	50%  { transform: rotate(180deg); }
	to   { transform: rotate(360deg); }
}

</style>

<template>
  <div class="message-main-con">
    <div class="message-mainlist-con">
      <div>
        <Button @click="setCurrentMesType('all')" size="large" long type="text">
			<transition name="mes-current-type-btn">
				<Icon v-show="currentMessageType === 'all'" type="checkmark"></Icon>
			</transition>
			<span class="mes-type-btn-text">全部通知</span>
        </Button>
      </div>

      <div>
        <Button @click="setCurrentMesType('unread')" size="large" long type="text">
			<transition name="mes-current-type-btn">
				<Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon>
			</transition>
			<span class="mes-type-btn-text">未读通知({{ unreadCount }})</span>
        </Button>
      </div>
	  <div>
        <Button @click="setCurrentMesType('hasRead')" size="large" long type="text">
			<transition name="mes-current-type-btn">
				<Icon v-show="currentMessageType === 'hasRead'" type="checkmark"></Icon>
			</transition>
			<span class="mes-type-btn-text">已读消息</span>
        </Button>
      </div>
    </div>
    <div class="message-content-con">
		<div class="msg-control">
			<div class="msg-control-btn-group">
				<Button type="primary" @click="dele">删除</Button>
				<Button type="primary" @click="mark('hasRead')">标记为已读</Button>
				<Button type="primary" @click="mark('unread')">标记为未读</Button>
			</div>
			<div class="msg-control-type-select">
				<Select v-model="messageType" @on-change="msgTypeChange">
					<Option value="0">全部类型</Option>
					<Option value="1">营业</Option>
					<Option value="2">库存</Option>
					<Option value="3">评论</Option>
				</Select>
			</div>
		</div>
		<transition name="view-message">
			<div class="table-wrapper">
				<Table
					ref="messageList"
					:columns="mesTitleColumns"
					:data="currentMesList"
					:no-data-text="noDataText"
					@on-selection-change="getSelection"
				/>
				<Spin fix v-show="loading">
					<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
					<div>Loading</div>
				</Spin>
			</div>

		</transition>
		<div class="page-wrapper">
			<Page :total="typeTotal" :current="pageNum" :page-size="10" show-elevator @on-change="pageChange" />
		</div>

    </div>
  </div>
</template>

<script>
import dateTools from '@/tools/dateTools';

const MSG_STATE_MAP = {
	'all': 0,
	'unread': 1,
	'hasRead': 2
};

const MSG_TYPE_2_STRING_MAP = ['营业', '库存', '评论'];

const MSG_CHILD_MODULE_TYPE_TO_ROUTER_MAP = [
	'/business/booking',
	'/orderDetail?orderId',
	'/stock/into-warehouse',
	'/comment/index'
];

export default {
	name: 'message_index',
	data () {
		return {
			loading: false,
			messageType: '0',
			selection: [],

			currentMesList: [],
			unreadMesList: [],
			hasReadMesList: [],
			allList: [],

			currentMessageType: 'all',
			unreadCount: 0,
			hasReadCount: 0,
			typeTotal: 0,
			total: 1000,
			pageNum: 1,
			noDataText: '暂无消息',
			mesTitleColumns: [
				{
					type: 'selection',
					width: 30,
					align: 'left'
				},
				{
					title: '通知内容',
					key: 'title',
					align: 'left',
					ellipsis: true,
					render: (h, params) => {
						return h(
							'a',
							{
								'class': {
									'has-read': params.row.state === MSG_STATE_MAP['hasRead']
								},
								on: {
									click: () => {
										/**
										 *  0:预定 1：订单 2： 库存  3：评论
										 *  0 - path: /business/booking, 	name: booking
										 *  1 - /orderDetail 				order_detail
										 *  2 - /stock/into-warehouse 		into-warehouse
										 *  3 - /comment/index 				comment_index
										 */
										const childModule = params.row.childModule;
										const routeInfoArr = MSG_CHILD_MODULE_TYPE_TO_ROUTER_MAP[childModule].split('?');

										this.$router.push({
											path: routeInfoArr[0],
											query: {
												[routeInfoArr[1]]: params.row.detailId
											}
										});

										/**
										 * 当消息为未读状态时，点击将会mark它为 已读。
										 */
										if (params.row.state === MSG_STATE_MAP['unread']) {
											this.$request.post('/noticeSetting/mark', { ids: [params.row.id], hasRead: true })
												.then(res => {
													if (res.errCode === '000000') {
														// 可以不用重新拉取数据，以到达将当前数据标记的目的。
														if (this.currentMessageType === 'unread') {
															this.currentMesList.splice(params.index, 1);
														}
														params.row.state = MSG_STATE_MAP['hasRead'];
														this.unreadCount--;
														// 通知铃铛处更新数据。
														this.$store.commit('setIfNeedMsgTipUpdateFlag', true);
													} else {
														this.$Message.warn('标记失败');
													}
												})
												.catch(err => {
													this.$Message.warn(err.message);
												});
										}
									}
								}
							},
							params.row.title
						);
					}
				},
				{
					title: '时间',
					key: 'time',
					align: 'center',
					render: (h, params) => {
						return h('span', {
							'class': {
								'has-read': params.row.state === MSG_STATE_MAP['hasRead']
							}
						}, [
							h('Icon', {
								props: {
									type: 'android-time',
									size: 12
								},
								style: {
									margin: '0 5px'
								}
							}),
							h(
								'span',
								{
									props: {
										type: 'android-time',
										size: 12
									}
								},
								this.formatDate(params.row.time)
							)
						]);
					}
				},
				{
					title: '通知类型',
					key: 'msgType',
					align: 'center',
					render: (h, params) => {
						return h('div', {
							'class': {
								'has-read': params.row.state === MSG_STATE_MAP['hasRead']
							}
						}, MSG_TYPE_2_STRING_MAP[params.row.msgType - 1]);
					}
				}
			]
		};
	},
	computed: {
		ifNeedUpdate () {
			return this.$store.state.app.ifNeedMsgListUpdateFlag;
		}
	},
	created () {
		if (this.$route.params.type) {
			this.setCurrentMesType('unread');
		}
		this.getList();
	},
	methods: {
		formatDate (time) {
			return dateTools.format('yyyy/MM/dd hh:mm:ss', new Date(time));
		},
		setCurrentMesType (type) {
			if (this.currentMessageType === type) {
				return false;
			}
			this.currentMessageType = type;
			this.pageNum = 1;
			if (type === 'unread') {
				this.noDataText = '暂无未读消息';
				this.typeTotal = this.unreadCount;
			} else if (type === 'hasRead') {
				this.noDataText = '暂无已读消息';
				this.typeTotal = this.hasReadCount;
			} else {
				this.noDataText = '暂无消息';
				this.typeTotal = this.total;
			}
			this.getList();
		},
		getList () {
			const params = {
				pageSize: 10,
				pageNum: this.pageNum,
				msgType: this.messageType,	// (default) 0:'全部' 1：营业' 2：库存 3： 评论，
				status: MSG_STATE_MAP[this.currentMessageType]	// (default) 0:'全部' 1：未读' 2：已读
			};
			this.loading = true;
			this.$request.post('/noticeSetting/list', params)
				.then(res => {
					this.loading = false;
					if (res.errCode === '000000') {
						const result = res.result;
						this.currentMesList = result.list;
						this.typeTotal = this.total = result.total;
						this.unreadCount = result.unreadCount;
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		pageChange (pageNum) {
			this.pageNum = pageNum;
			this.getList();
		},
		msgTypeChange (value) {
			// if (this.$refs['messageList']) {
			// 	console.log(this.$refs['messageList'].rebuildData);
			// 	this.$refs['messageList'].selectAll(false);
			// }

			this.pageNum = 1;
			this.getList();
		},
		getSelection (selection) {
			this.selection = selection;
		},
		dele () {
			const ids = this.selection.map(item => item.id);
			if (ids.length) {
				this.$request.post('/noticeSetting/delete', { ids })
					.then(res => {
						if (res.errCode === '000000') {
							this.getList();
						} else {
							this.$Message.warn('删除失败');
						}
					})
					.catch(err => {
						this.$Message.warn(err.message);
					});
			}
		},
		mark (flag) {
			const ids = this.selection.map(item => item.id);
			if (ids.length) {
				let hasRead = true;
				if (flag === 'unread') {
					hasRead = false;
				}

				this.$request.post('/noticeSetting/mark', { ids, hasRead })
					.then(res => {
						if (res.errCode === '000000') {
							this.getList();
							this.$store.commit('setIfNeedMsgTipUpdateFlag', true);
						} else {
							this.$Message.warn('标记失败');
						}
					})
					.catch(err => {
						this.$Message.warn(err.message);
					});
			}
		}
	},
	activated () {
		if (this.ifNeedUpdate) {
			this.getList();
			this.$store.commit('setIfNeedMsgListUpdateFlag', false);
		}
	}
};
</script>
