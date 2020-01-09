<style lang="less" scoped>
@import './commons/style.less';
.notice-wrapper {
	margin-bottom: 20px;
}
.sit-wrapper {
	position: relative;
	height: 300px;
}
</style>

<template>
	<div id="notice-setting">
		<div class="notice-wrapper">
			<div class="top-bar">
				<div class="left">商家后台通知设置</div>
			</div>
			<div class="content">
				<Table :columns="businessBackEndSettingCol" :data="noticeData.pc"></Table>
			</div>
		</div>
		<div class="notice-wrapper">
			<div class="top-bar">
				<div class="left">商家微信端通知设置</div>
				<div class="right">
					<Button type="success" @click="toBusinessWechatNoticeList">微信通知列表</Button>
				</div>
			</div>
			<div class="content">
				<Table :columns="businessWechatSettingCol" :data="noticeData.wx" v-if="canUse"/>
				<div class="sit-wrapper" v-else>
					<is-sit-version />
				</div>
			</div>
		</div>
		<div class="notice-wrapper">
			<div class="top-bar">
				<div class="left">用户微信端通知设置</div>
			</div>
			<div class="content">
				<Table :columns="customerWechatSettingCol" :data="noticeData.user" v-if="canUse"/>
				<div class="sit-wrapper" v-else>
					<is-sit-version />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';

export default {
	components: {
		IsSitVersion
	},
	data () {
		const commonCol = [
			{
				title: '序号',
				type: 'index'
			},
			{
				title: '标题',
				key: 'title'
			},
			{
				title: '消息类型',
				key: 'type'
			},
			{
				title: '操作',
				key: 'action',
				render: (h, params) => {
					return h('i-switch', {
						props: {
							size: 'large',
							value: params.row.state
						},
						on: {
							'on-change': (newState) => {
								this.updateState(params.row.notice_state_id, newState)
									.then(() => {
										this.$store.dispatch('UpdateUserAuth');
									})
									.catch(err => {
										this.$Message.error(err.message);
										params.row.state = !newState;
									});
							},
							input: (state) => {
								params.row.state = state;
							}
						}
					}, [
						h('span', {
							slot: 'open',
							domProps: {
								innerHTML: '启用'
							}
						}),
						h('span', {
							slot: 'close',
							domProps: {
								innerHTML: '禁用'
							}
						})
					]);
				}
			}
		];

		const copyCommonCol = [...commonCol];
		copyCommonCol.splice(2, 1);
		return {
			businessBackEndSettingCol: commonCol,
			businessWechatSettingCol: commonCol,
			customerWechatSettingCol: copyCommonCol,
			noticeData: {
				pc: [],
				wx: [],
				user: []
			},
			showAddNewNotice: false,
			newNotice: {
				contentList: [],
				hasQrCode: false,
				qrCodeUrl: ''
			},
			loading: false,
			canUse: false
		};
	},
	methods: {
		getNoticeList () {
			this.$request.post('noticeSetting/noticeList')
				.then(res => {
					if (res.errCode === '000000') {
						const result = res.result;
						this.noticeData.pc = result.pc;
						this.noticeData.wx = result.wx;
						this.noticeData.user = result.user;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		updateState (id, state) {
			const params = { notice_state_id: id, state };
			return new Promise((resolve, reject) => {
				this.$request.post('noticeSetting/changeState', params)
					.then(res => {
						if (res.errCode === '000000') {
							resolve();
						} else {
							throw new Error(res.errMsg);
						}
					})
					.catch(err => {
						reject(err);
					});
			});
		},
		toBusinessWechatNoticeList () {
			if (!this.canUse) {
				this.$Message.error('此功能在正式版中开通');
				return false;
			}
			this.$router.push({
				name: 'businessWechatNoticeList'
			});
		}
	},
	created () {
		this.getNoticeList();
		this.$store
			.dispatch('GetAppInfo')
			.then(({ canUse }) => {
				this.canUse = canUse;
				// if (canUse) {
				// 	this.getNoticeList();
				// }
			})
			.catch(err => {
				console.log(err);
			});
	}
};
</script>

