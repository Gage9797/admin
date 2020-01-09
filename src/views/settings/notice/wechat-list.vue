<style lang="less" scoped>
@import './commons/style.less';

.notice-choose {
	main {
		padding: 10px;
	}
}
</style>

<template>
	<div id="notice-setting">
		<div class="notice-wrapper">
			<div class="top-bar">
				<div class="left">微信通知列表</div>
				<div class="right">
					<Button type="success" @click="addNewNotice">新增通知人员</Button>
				</div>
			</div>
			<div class="content">
				<Table :columns="noticeList" :data="noticeData"></Table>
			</div>

			<!--生成二维码的弹窗-->
			<Modal
				v-model="showAddNewNotice"
				title="新增通知人员"
				width="400"
				@on-ok="getNoticeList">
				<div class="notice-choose" >
					<!-- the staff -->
					<h2>选择员工</h2>
					<main>
						<Select v-model="theStaffSelected" style="width:200px">
							<Option v-for="item in staffList" :value="item.staffId" :key="item.staffId">{{ item.name }}</Option>
						</Select>
					</main>

					<!-- generate qr code -->
					<h2>通知内容</h2>
					<main>
						<CheckboxGroup v-model="newNotice.contentList">
							<Checkbox label="1">营业</Checkbox>
							<Checkbox label="2">库存</Checkbox>
							<Checkbox label="3">评论</Checkbox>
						</CheckboxGroup>
						<div v-if="newNotice.hasQrCode" style="margin-top: 20px; text-align: center;">
							<img :src="newNotice.qrCodeUrl" style="width: 150px;height: 150px;" alt="图片加载失败">
						</div>
						<div style="margin-top: 20px;">
							<Button @click="getQrCode(newNotice.contentList)" type="primary" :loading="loading">
								<span v-if="!loading">生成二维码</span>
								<span v-else>生成中......</span>
							</Button>
						</div>
					</main>
				</div>
			</Modal>

			<!-- 修改员工通知内容 -->
			<Modal
				title="新增微信通知员工"
				v-model="showUpdateModal"
				:loading="loading"
				@on-ok="updateNoticeRowConfirm">
				<Form :model="updateItem" :label-width="80">
					<FormItem label="员工账号:">
						<span>{{ updateItem.account }}</span>
					</FormItem>
					<FormItem label="员工姓名:">
						<span>{{ updateItem.name }}</span>
					</FormItem>
					<FormItem label="员工部门:">
						<span>{{ updateItem.department }}</span>
					</FormItem>
					<FormItem label="通知内容:">
						<CheckboxGroup v-model="contentList">
							<Checkbox label="1">营业</Checkbox>
							<Checkbox label="2">库存</Checkbox>
							<Checkbox label="3">评论</Checkbox>
						</CheckboxGroup>
					</FormItem>
				</Form>
			</Modal>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			noticeList: [
				{
					title: '员工账号',
					key: 'account'
				},
				{
					title: '员工姓名',
					key: 'name'
				},
				{
					title: '员工部门',
					key: 'department'
				},
				{
					title: '通知内容',
					key: 'noticeContent',
					render: (h, params) => {
						let contentStr = '';
						const row = params.row;
						if (row.business) {
							contentStr += '营业、';
						}
						if (row.inventory) {
							contentStr += '库存、';
						}
						if (row.comment) {
							contentStr += '评论、';
						}

						return h('div', contentStr.substring(0, contentStr.length - 1));
					}
				},
				{
					title: '操作',
					key: 'option',
					width: 160,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h(
								'Button',
								{
									props: {
										type: 'primary',
										size: 'small',
										icon: 'edit'
									},
									style: {
										marginRight: '10px'
									},
									on: {
										click: () => {
											this.updateNoticeRow(params.row);
										}
									}
								},
								'修改'
							),
							h(
								'Button',
								{
									props: {
										type: 'error',
										size: 'small',
										icon: 'ios-trash'
									},
									on: {
										click: () => {
											this.deleteConfirm(params.row.notice_setting_id, params.index);
										}
									}
								},
								'删除'
							)
						]);
					}
				}
			],
			staffList: [],
			theStaffSelected: '',
			noticeData: [],
			showAddNewNotice: false,
			newNotice: {
				contentList: [],
				hasQrCode: false,
				qrCodeUrl: ''
			},
			loading: false,
			showUpdateModal: false,
			updateItem: {
				account: '',
				name: '',
				department: '',
				contentList: []
			},
			contentList: []
		};
	},
	methods: {
		// 获取通知列表
		getNoticeList () {
			this.$request.post('/noticeSetting/staffNoticeList')
				.then(res => {
					if (res.errCode === '000000') {
						this.noticeData = res.result.list;
					} else {
						this.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// get staff list
		getStaffList () {
			this.$request.post('/noticeSetting/getStaffList')
				.then(res => {
					if (res.errCode === '000000') {
						const list = res.result.list;
						this.staffList = list;
						this.theStaffSelected = list[0].staffId;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 删除确认弹框
		deleteConfirm (id, index) {
			this.$Modal.confirm({
				title: '删除确认',
				content: '<p>确定删除该微信通知人员吗？</p>',
				onOk: () => {
					this.deleteNotice(id, index);
				}
			});
		},
		// 删除通知
		deleteNotice (id, index) {
			const params = {
				notice_setting_id: id
			};
			this.$request.post('/noticeSetting/delNoticeAuth', params)
				.then((res) => {
					if (res.errCode === '000000') {
						// this.getNoticeList();
						this.noticeData.splice(index, 1);
					} else {
						this.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch((err) => {});
		},
		// 新增通知人员的弹窗
		addNewNotice () {
			// 重置
			this.newNotice = {
				contentList: [],
				hasQrCode: false,
				qrCodeUrl: ''
			};
			this.showAddNewNotice = true;
		},
		// 处理生成二维码的动作
		getQrCode (content) {
			if (content.length === 0) {
				return this.$Message.error('请先选择通知内容');
			}
			content = content.map(item => parseInt(item));
			const params = {
				content,
				staffId: this.theStaffSelected
			};
			this.getQrCodeUrl(params);
		},
		// 向后端请求二维码
		getQrCodeUrl (params) {
			this.loading = true;

			this.$request.post('noticeSetting/getQR', params)
				.then(res => {
					this.loading = false;
					if (res.errCode === '000000') {
						this.newNotice.qrCodeUrl = this.$config.resourceUrl + res.result.qrCode;
						this.newNotice.hasQrCode = true;
						this.loading = false;
					} else {
						this.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(err => {
					console.log(err);
					this.$Message.error(err.message);
					this.loading = false;
				});
		},
		// 唤起修改弹出、数据处理
		updateNoticeRow (row) {
			this.showUpdateModal = true;
			this.updateItem = row;

			let list = [];

			if (row.business) {
				list.push('1');
			}
			if (row.inventory) {
				list.push('2');
			}
			if (row.comment) {
				list.push('3');
			}

			// this.updateItem.contentList = list; checkbox不支持嵌套属性
			this.contentList = list;
		},
		updateNoticeRowConfirm () {
			let contentList = this.contentList;
			contentList = contentList.map(item => parseInt(item));
			let params = {
				business: contentList.indexOf(1) !== -1,
				inventory: contentList.indexOf(2) !== -1,
				comment: contentList.indexOf(3) !== -1,
				notice_setting_id: this.updateItem.notice_setting_id
			};

			this.$request.post('/noticeSetting/changeNoticeAuth', params)
				.then(res => {
					this.loading = false;
					if (res.errCode === '000000') {
						this.getNoticeList();
						this.$Message.success('修改成功');
					} else {
						this.$Message.warn(res.errMsg);
					}
				})
				.catch(err => {
					this.loading = false;
					this.$Message.warn(err.message);
				});
		}
	},
	created () {
		this.$store.dispatch('GetAppInfo')
			.then(({ canUse }) => {
				if (!canUse) {
					this.$router.push({
						name: 'home_index'
					});
				} else {
					this.getNoticeList();
					this.getStaffList();
				}
			})
			.catch(err => {
				console.error(err);
			});
	}
};
</script>

