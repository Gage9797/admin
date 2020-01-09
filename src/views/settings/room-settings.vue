<template>
  <div id="room-settings">
    <div class="top-bar">
      <div class="left">
        包间列表
      </div>
      <div class="right">
        <Button type="success" @click="toAddRoom">新增包间</Button>
      </div>
    </div>
    <div class="content">
      <Table :columns="roomColumns" :data="roomList"></Table>
      <div style="text-align: center; margin-top: 20px;">
        <Page :total="totalCount" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
#room-settings {
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
</style>

<script>
import { downloadImgPrefix } from '@/config';

export default {
	data () {
		return {
			canUse: false,
			roomColumns: [
				{
					align: 'center',
					title: '包间名',
					key: 'name'
				},
				{
					align: 'center',
					title: '推荐人数',
					key: 'dimension'
				},
				{
					align: 'center',
					title: '单价',
					key: 'priceValue'
				},
				{
					align: 'center',
					title: '定金',
					key: 'earnest'
				},
				{
					align: 'center',
					title: '是否可用',
					key: 'stateName'
				},
				{
					title: '点餐二维码',
					key: 'download',
					align: 'center',
					render: (h, params) => {
						// console.log(params.row);
						if (this.canUse) {
							return h('div', [
								h('a', {
									attrs: {
										href: downloadImgPrefix + '/settings/qr/download?path=' + params.row.qrurl,
										target: '_blank'
									}
								}, '点击下载')
							]);
						} else {
							return h('div', '仅在正式版中开通');
						}
					}
				},
				{
					align: 'center',
					title: '操作',
					key: 'action',
					width: 150,
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
											this.toModify(params.row);
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
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.deleteConfirm(params.row);
										}
									}
								},
								'删除'
							)
						]);
					}
				}
			],
			roomList: [],
			currentPage: 1,
			pageSize: 10,
			totalCount: 0
		};
	},
	methods: {
		// 对获取的包间列表进行处理，用于在表格显示
		dealRoomList (list) {
			list.map((ele) => {
				ele.dimension = ele.min + '-' + ele.max + '人';
				ele.stateName = ele.state === 0 ? '否' : '是';
			});
			return list;
		},
		// 获取包间列表
		getRoomList () {
			let self = this;
			let params = {
				teaHouseId: this.$util.getTeaHouseId(),
				currentPage: this.currentPage,
				pageSize: this.pageSize
			};
			this.$http
				.request(this, 'POST', '/settings/room/list', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.roomList = self.dealRoomList(res.result.list);
						// console.log(self.roomList);
						self.totalCount = res.result.total;
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		// 切换页码
		changePage (page) {
			this.currentPage = page;
			this.getRoomList();
		},
		// 删除询问弹框
		deleteConfirm (params) {
			this.$Modal.confirm({
				title: '删除确认',
				content: `<p>确定删除包间： ${params.name} 吗？</p>`,
				onOk: () => {
					this.deleteRoom(params.id);
				}
			});
		},
		// 删除包间
		deleteRoom (id) {
			let self = this;
			let params = {
				id: id
			};
			this.$http
				.request(this, 'POST', '/settings/room/delete', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.getRoomList();
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
					self.error('网络异常');
				});
		},
		// 进入新增包间的编辑页面
		toAddRoom () {
			this.$router.push({
				name: 'room_edit',
				params: {
					id: -1
				}
			});
		},
		// 进入修改页面
		toModify (params) {
			this.$router.push({
				name: 'room_edit',
				params: params
			});
		}
	},
	created () {
		this.getRoomList();

		this.$store.dispatch('GetAppInfo')
			.then(({ canUse }) => {
				this.canUse = canUse;
			})
			.catch(err => {
				console.error(err);
			});
	}
};
</script>

