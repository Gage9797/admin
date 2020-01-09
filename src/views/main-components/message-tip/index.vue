<style lang="less" scoped>
.message-con {
	.content {
		p {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: left;

			&:hover {
				color: #c3a451
			}
		}
	}
}

</style>

<template>
    <div class="message-con" @click="showMessage">
		<Poptip trigger="hover" placement="bottom" width="300">
			<Badge :count="msgCount" overflow-count="9" >
				<Icon
					type="ios-bell"
					:size="22"
					color="#c3a451">
				</Icon>
			</Badge>
			<div class="content" slot="content">
				<p v-for="(msg, index) in lastFiveMsg" :key="index" @click.stop="toDetail(msg, index)">{{ msg.title || msg.content }}</p>
				<Button type="text" @click="showMessage('unread')">more...</Button>
			</div>
		</Poptip>
		<audio id="myAudio" style="display: none;">
			<source src="http://cdn.gzqlwk.com/notify.mp3">
		</audio>
    </div>
</template>

<script>
import Client from './websocket';
import { WS_1_ADRRESS } from '@/config';

let myAudio = null;

const MSG_TYPE_MAP = ['营业', '库存', '评论'];

const MSG_CHILD_MODULE_TYPE_TO_ROUTER_MAP = [
	'/business/booking',
	'/orderDetail?orderId',
	'/stock/into-warehouse',
	'/comment/index'
];

export default {
	name: 'messageTip',
	data () {
		return {
			unreadMsg: [],
			msgCount: 0,
			client1: null
		};
	},
	computed: {
		ifNeedUpdate () {
			return this.$store.state.app.ifNeedMsgTipUpdateFlag;
		},
		// ifNeedMsgGoodsellUpdataFlag () {
		// 	return this.$store.state.app.ifNeedMsgGoodsellUpdataFlag;
		// },
		// ifNeedMsgDeliveryUpdataFlag () {
		// 	return this.$store.state.app.ifNeedMsgDeliveryUpdataFlag;
		// },
		lastFiveMsg () {
			// 只显示五条（不管拉取回来的数据有多少条。）
			return this.unreadMsg.slice(0, 5);
		}
	},
	created () {
		this.getUnreadList();
		this.subscribeNotice();

		let timer;
		this.$Notice.config({
			top: window.innerHeight - 100
		});

		window.addEventListener('resize', () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				this.$Notice.destroy();
				this.$nextTick(() => {
					this.$Notice.config({
						top: window.innerHeight - 100
					});
				});
			}, 100);
		});

		this.$nextTick(() => {
			myAudio = document.getElementById('myAudio');
		});
	},
	methods: {
		getUnreadList () {
			const params = {
				pageNum: 1,
				pageSize: 50,
				msgType: 0,	// (default) 0:'全部' 1：营业' 2：库存 3： 评论，
				status: 1	// (default) 0:'全部' 1：未读' 2：已读
			};
			this.$request.post('/noticeSetting/list', params)
				.then(res => {
					if (res.errCode === '000000') {
						const result = res.result;
						this.msgCount = result.unreadCount;
						this.unreadMsg = result.list;

						// 如果拉取回来的未读消息少于请求pageSize的数目，则判断为已经没有未取回来的新消息。
						this.hasNoNew = this.msgCount < 50;
					} else {
						this.$Message.error(res.errMsg);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		showMessage (type) {
			// util.openNewPage(this, 'message_index');
			this.$router.push({
				name: 'message_index',
				params: {
					type
				}
			});
		},
		subscribeNotice () {
			this.client1 = new Client({address: WS_1_ADRRESS});
			this.client1.on('data', (data) => {
				if (data.type === 10 || data.type === 9) {
					this.reflash(data);
				}
				this.processMsg(data);
			});
		},
		reflash (data) {
			if (data.type === 9) {
				this.$store.commit('setGoodsellUpdate', {newState: data.newState, oldState: data.oldState});
				this.$store.commit('setIfNeedMsgGoodsellUpdataFlag', true);
			} else {
				this.$store.commit('setDeliveryUpdata', {newState: data.newState, oldState: data.oldState});
				this.$store.commit('setIfNeedMsgDeliveryUpdataFlag', true);
			}
		},
		processMsg (data) {
			myAudio.play();
			let msg = `您收到一条新的${MSG_TYPE_MAP[data.type - 1]}消息`;
			if (data.type === 10) {
				msg = '快递订单有更新';
			} else if (data.type === 9) {
				msg = '门店订单有更新';
			}
			setTimeout(() => {
				this.$Notice.open({
					title: '新消息',
					desc: msg,
					duration: 60
				});
			}, 300);
			this.unreadMsg.unshift(data);
			this.msgCount++;
			this.$store.commit('setIfNeedMsgListUpdateFlag', true);
		},
		toDetail (msgObj, index) {
			const childModule = msgObj.childModule;
			const routeInfoArr = MSG_CHILD_MODULE_TYPE_TO_ROUTER_MAP[childModule].split('?');
			this.markAsHasRead(msgObj.id);
			this.unreadMsg.splice(index, 1);
			this.msgCount--;
			this.$router.push({
				path: routeInfoArr[0],
				query: {
					[routeInfoArr[1]]: msgObj.detailId
				}
			});
		},
		markAsHasRead (id) {
			return this.$request.post('/noticeSetting/mark', { ids: [id], hasRead: true })
				.then(res => {
					if (res.errCode === '000000') {
						// 如果现在未读的数量少于五 并且 拉取回来的数量不少于50，则判断后台仍有未拉取回来的未读消息，需要再拉取一次消息回来。
						if (this.msgCount < 5 && !this.hasNoNew) {
							this.getUnreadList();
						}
						this.$store.commit('setIfNeedMsgListUpdateFlag', true);
					} else {
						// this.$Message.warn('标记失败');
					}
				})
				.catch(err => {
					this.$Message.warn(err.message);
				});
		}
	},
	beforeDestroy () {
		this.client1 && this.client1.close();
	},
	watch: {
		ifNeedUpdate: {
			immediate: true,
			handler: function (flag) {
				if (flag) {
					this.getUnreadList();
					this.$store.commit('setIfNeedMsgTipUpdateFlag', false);
				}
			}
		}
		// ifNeedMsgGoodsellUpdataFlag: {
		// 	immediate: true,
		// 	handler: function (flag) {
		// 		if (flag) {
		// 			this.getUnreadList();
		// 			this.$store.commit('setIfNeedMsgGoodsellUpdataFlag', false);
		// 		}
		// 	}
		// },
		// ifNeedMsgDeliveryUpdataFlag: {
		// 	immediate: true,
		// 	handler: function (flag) {
		// 		if (flag) {
		// 			this.getUnreadList();
		// 			this.$store.commit('setIfNeedMsgDeliveryUpdataFlag', false);
		// 		}
		// 	}
		// }
	}
};
</script>
