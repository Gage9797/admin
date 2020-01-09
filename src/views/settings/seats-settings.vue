<template>
  <div id="seats-settings">
    <div class="top-bar">
      <div class="left">
        散座列表
      </div>
      <div class="right">
        <Button
          type="success"
          @click="editNewSeat">
          新增散座
        </Button>
      </div>
    </div>
    <div class="content">
      <Table :columns="seatsList" :data="seatsData"></Table>
    </div>
    <!--编辑框-->
    <Modal
      v-model="showEditFrame"
      :title="title"
      @on-ok="modifyOrAdd"
      >
      <Card>
        <div style="height:36px;" slot="title">
          <div style="text-align: center;line-height:36px;">散座设置</div>
        </div>
        <Form :label-width="80">
          <FormItem label="散座名称">
            <Input placeholder="散座名称" v-model="currentSeat.name" :maxlength="20"/>
          </FormItem>
          <FormItem label="推荐人数">
            <InputNumber
				v-model="currentSeat.min"
				:min="1"
				:max="1024"
				:precision="0"
				style="height: 30px;border: 1px solid #ddd;border-radius: 5px;outline: none;text-indent: 5px;" />
            到
            <InputNumber
				v-model="currentSeat.max"
				:min="1"
				:max="1024"
				:precision="0"
				style="height: 30px;border: 1px solid #ddd;border-radius: 5px;outline: none;text-indent: 5px;" />
            人
          </FormItem>
        </Form>
      </Card>
	  <div slot="footer">
   			<Button type="text" @click="showEditFrame = false">取消</Button>
            <Button type="primary" @click="modifyOrAdd">确定</Button>
	  </div>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
#seats-settings {
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
			teaHouseId: this.$util.getTeaHouseId(),
			seatsList: [
				{
					title: '散座名称',
					key: 'name'
				},
				{
					title: '推荐人数',
					key: 'num'
				},
				{
					title: '散座点餐二维码',
					key: 'download',
					align: 'center',
					render: (h, params) => {
						if (this.canUse) {
							return h('div', [
								h('a', {
									attrs: {
										href: downloadImgPrefix + '/settings/qr/download?path=' + params.row.qrCode,
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
					title: '操作',
					key: 'option',
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
										this.editSeat(params.row);
									}
								}
							}, '修改'),
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
										this.deleteConfirm(params.row);
									}
								}
							}, '删除')
						]);
					}
				}
			],
			seatsData: [],
			showEditFrame: false,
			currentSeat: {
				min: 1,
				max: 1,
				name: ''
			},
			canUse: false,
			title: '修改散座信息'
		};
	},
	created () {
		this.getSeatsList();
		this.$store.dispatch('GetAppInfo')
			.then(({ canUse }) => {
				this.canUse = canUse;

				// if (canUse) {
				// 	this.getSeatsList();
				// }
			})
			.catch(err => {
				console.error(err);
			});
	},
	methods: {
		// 列表数据格式化
		formatData (data) {
			data.map((ele) => {
				ele.num = ele.min + ' - ' + ele.max;
			});
			return data;
		},
		// 获取散座列表
		getSeatsList () {
			let self = this;
			let params = {
				teaHouseId: this.$util.getTeaHouseId()
			};
			this.$http.request(this, 'POST', '/settings/seat/list', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.seatsData = self.formatData(res.result.list).reverse();
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
		// 跳出删除散座的确认弹层
		deleteConfirm (param) {
			this.$Modal.confirm({
				title: '删除确认',
				content: `<p>确定删除散座： ${param.name} 吗？</p>`,
				onOk: () => {
					this.deleteSeat(param.id);
				}
			});
		},
		// 删除散座
		deleteSeat (id) {
			let self = this;
			let params = {
				id: id
			};
			this.$http.request(this, 'POST', '/settings/seat/delete', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.getSeatsList();
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
		// 提交编辑，分流到新增和修改
		modifyOrAdd () {
			if (this.currentSeat.id) {
				this.modifySeat();
			} else {
				this.addNewSeat();
			}
		},
		// 修改编辑框
		editSeat (param) {
			this.currentSeat = Object.assign({}, param);
			this.title = '修改散座信息';
			this.showEditFrame = true;
		},
		// 修改散座
		modifySeat () {
			if (this.currentSeat.name.trim() === '') {
				return this.$Message.error('散座名称不可为空');
			} else if (this.currentSeat.min > this.currentSeat.max) {
				return this.$Message.error('推荐人数最大值不可小于最小值');
			}
			let self = this;
			let params = {
				id: this.currentSeat.id,
				name: this.currentSeat.name,
				min: parseInt(this.currentSeat.min),
				max: parseInt(this.currentSeat.max)
			};
			this.$http.request(this, 'POST', '/settings/seat/modify', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.showEditFrame = false;
						self.getSeatsList();
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
		// 编辑新增散座
		editNewSeat () {
			this.currentSeat = {
				min: 1,
				max: 1,
				name: ''
			};
			this.title = '新增散座';
			this.showEditFrame = true;
		},
		// 新增散座
		addNewSeat () {
			if (this.currentSeat.name.trim() === '') {
				return this.$Message.error('散座名称不可为空');
			} else if (this.currentSeat.min > this.currentSeat.max) {
				return this.$Message.error('推荐人数最大值不可小于最小值');
			}

			let self = this;
			let params = {
				teaHouseId: this.$util.getTeaHouseId(),
				name: this.currentSeat.name,
				min: parseInt(this.currentSeat.min),
				max: parseInt(this.currentSeat.max)
			};
			this.$http.request(this, 'POST', '/settings/seat/add', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.showEditFrame = false;
						self.getSeatsList();
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
				});
		}

	}
};
</script>

