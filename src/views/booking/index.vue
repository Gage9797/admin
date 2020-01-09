<style lang="less" scoped>
.booking-data {
	position: relative;
	padding: 0 10px 20px;
	background-color: #e4e4e2;

	.ctrl-bar-search {
		margin-top: -10px;
		padding: 5px;
		background-color: #fff;
		background: rgb(228, 228, 226);
		border-bottom: 1px solid rgb(210, 210, 210);
	}
	.table-wrapper {
		position: relative;
	}
	.reserve-setting-table {
		margin-bottom: 50px;
	}
}
/deep/ .ivu-table td {
  background: rgb(235, 235, 233);
  border-bottom: 1px solid rgb(210, 210, 210);
}
/deep/ .ivu-table th {
  background: rgb(235, 235, 233);
  border-bottom: 1px solid rgb(210, 210, 210);
  color: rgb(107, 92, 67);
}
/deep/ .ivu-input {
  background: rgb(235, 235, 233);
}
/deep/ .ivu-select-selection {
  background: rgb(235, 235, 233);
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
</style>

<template>
  <div id="booking">
    <div class="ctrl-bar">
		<Tabs type="card" v-model="state">
			<TabPane label="已预订" name="3" class="ql-tab-pane"/>
			<TabPane label="已完成" name="4" class="ql-tab-pane"/>
			<TabPane label="已取消" name="8" class="ql-tab-pane"/>
		</Tabs>

		<main class="booking-data">
			<div class="ctrl-bar-search">
				<i-form label-position="left" :label-width="80" :model="searchForm" ref="searchForm">
					<i-row>
						<i-col span="10">
						<i-form-item label="预约时间">
							<i-date-picker
								:editable="false"
								:options="datePickerOpts"
								type="daterange"
								v-model="searchForm.date"
								style="width: 80%"/>
						</i-form-item>
						</i-col>
						<i-col span="10">
						<i-form-item label="预约方式">
							<i-select v-model="searchForm.reserveMethond" style="width: 80%">
							<i-option
								v-for="t in reserveMethondList"
								:key="t.value"
								:value="t.value"
							>{{t.label}}</i-option>
							</i-select>
						</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="10">
						<i-form-item label="预约电话" prop="phone">
							<i-input v-model="searchForm.phone" style="width: 80%"></i-input>
						</i-form-item>
						</i-col>
						<i-col span="10">
						<i-form-item label="预约类型">
							<!-- <p style="text-align: center;">包间 - </p> -->
							<i-select v-model="searchForm.reserveType" style="width: 80%">
							<i-option v-for="r in roomList" :key="r.value" :value="r.value">{{r.label}}</i-option>
							</i-select>
						</i-form-item>
						</i-col>
						<i-button type="primary" @click="search" style="margin-left: 30px;">查询</i-button>
					</i-row>
				</i-form>
			</div>

			<div class="table-wrapper">
				<i-table :columns="tableColumns" :data="tableData" class="reserve-setting-table" />
				<Spin fix v-show="isTableLoading">
					<Icon type="load-c" size=18 class="spin-icon-load"></Icon>
					<div>Loading</div>
				</Spin>
			</div>

			<!-- <i-page
				style="text-align: center;"
				:current.sync="current"
				:total="pageTotal"
				show-elevator
				@on-change="changePage"
			/> -->
		</main>

    </div>

    <!-- 弹窗 s -->
    <Modal v-model="openModal" title="开台" ok-text="确认开台" :loading="isloading" @on-ok="openConfirm">
      <Form :model="openForm" label-position="left" :label-width="60">
        <FormItem :label="openForm.typeTitle">
          <span>{{openForm.type}}</span>
        </FormItem>
        <FormItem label="开台员工">
          <Select v-model="staff">
            <Option v-for="s in staffArr" :key="s.value" :value="s.value">{{ s.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="人数">
          <InputNumber :max="6" :min="1" v-model="openForm.number"></InputNumber>
        </FormItem>
        <!-- <FormItem label="计费设定">
          <Select v-model="openForm.chargeType" style="width:40%;">
            <Option v-for="c in chargeList" :key="c.value" :value="c.value">{{c.label}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="留言">
          <i-input type="textarea" v-model="openForm.comment"></i-input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="reserveModal" title="预订情况" :footer-hide="hideFooter">
      <i-form v-model="reserveForm" label-position="left">
        <i-row>
          <i-col span="10">
            <i-form-item label="包间：">
              <span style="word-break: break-all;">{{reserveForm.name}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1">
            <i-form-item label="预约时段：">
              <span>{{reserveForm.timePhase}}</span>
            </i-form-item>
          </i-col>
        </i-row>
        <i-row v-if="reserveForm.isReserveOnline">
          <i-col span="10">
            <i-form-item label="定金">
              <span>{{reserveForm.fee}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1">
            <i-form-item label="定金去向">
              <span>{{reserveForm.isFeeBack}}</span>
            </i-form-item>
          </i-col>
        </i-row>
        <i-row>
          <i-col span="10">
            <i-form-item label="顾客：">
              <span>{{reserveForm.consumerName}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1">
            <i-form-item label="联系方式：">
              <span>{{reserveForm.consumerPhone}}</span>
            </i-form-item>
          </i-col>
        </i-row>
		 <i-row>
          <i-col span="10">
            <i-form-item label="保留时长：">
              <span>{{reserveForm.keepTime}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1">
            <i-form-item label="操作员工：">
              <span>{{reserveForm.operationStaff}}</span>
            </i-form-item>
          </i-col>
        </i-row>
        <i-row>
          <i-col span="10">
            <i-form-item label="人数：">
              <span>{{reserveForm.peopleNum}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1" v-if="reserveForm.isFinished">
            <i-form-item label="就座时间：">
              <span>{{reserveForm.confirmTime}}</span>
            </i-form-item>
          </i-col>
          <i-col span="13" offset="1" v-if="reserveForm.isCanceled">
            <i-form-item label="取消时间：">
              <span>{{reserveForm.cancelTime}}</span>
            </i-form-item>
          </i-col>
        </i-row>
        <i-row>
          <i-col span="24">
            <i-form-item label="留言">
              <p style="word-break: break-all; word-wrap: break-word;">{{ reserveForm.comment }}</p>
            </i-form-item>
          </i-col>
        </i-row>

        <i-form-item style="text-align: center; margin-top: 20px;">
			<!-- 线下预定并且是处于预定状态下，可取消预定 -->
			<i-button
				type="primary"
				size="large"
				v-if="!reserveForm.isReserveOnline && state === '3'"
				@click="reserveCancel"
			>取消预订</i-button>
        </i-form-item>
      </i-form>
    </Modal>
    <!-- 弹窗 e -->
  </div>
</template>

<script>
import dateTools from '@/tools/dateTools.js';
import mixins from './mixins';

export default {
	name: 'goodsIndex',
	mixins: [mixins],
	data () {
		return {
			current: 1,
			state: '3',
			searchForm: {
				date: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()],
				reserveMethond: 0,
				phone: '',
				reserveType: -1
			},
			datePickerOpts: {
				disabledDate (date) {
					const now = Date.now();
					return (
						date.valueOf() > now // 今天之后的查询没有意义
					);
				}
			},
			reserveMethondList: [
				{
					value: 0,
					label: '全部'
				},
				{
					value: 1,
					label: '公众号预约'
				},
				{
					value: 2,
					label: '线下预约'
				}
			],
			roomList: [],
			tableData: [],
			pageTotal: 0,

			staff: '',
			staffArr: [],
			chargeList: [],
			chargeRule: {
				room: [],
				table: []
			},
			isloading: true,
			openModal: false,
			openForm: {
				typeTitle: '类型',
				type: '',
				number: 2,
				chargeType: '0',
				comment: ''
			},

			hideFooter: true,
			reserveModal: false,
			reserveModalOnline: false,
			reserveForm: {},
			isTableLoading: false
		};
	},
	methods: {
		getStaff () {
			this.$http
				.request(this, 'POST', '/teaTable/tableStaff', this.teaHouseId)
				.then(res => {
					console.log('预定管理', res);
					if (res.errCode === '000000') {
						this.staffArr = res.data.result.data;
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getChargeRule () {
			this.$http
				.request(this, 'POST', '/teaTable/tableChargeRule')
				.then(res => {
					if (res.data.errCode === '000000') {
						this.chargeList = res.data.result.data;
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				})
				.catch(err => {});
		},
		getRoomList () {
			this.$http
				.request(this, 'POST', '/teaTable/getTableList', {
					teaHouseId: this.teaHouseId
				})
				.then(res => {
					if (res.data.errCode === '000000') {
						const roomListData = res.data.result.roomList;
						let roomList = this.roomList;
						roomListData.forEach((i, index) => {
							roomList.push({
								value: i.id,
								label: i.name
							});
						});
						roomList.unshift({
							value: -1,
							label: '全部'
						});
					} else {
						this.$Message.error('拉去房间数据失败！');
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		getTableData (currentPage = 1) {
			const searchForm = this.searchForm;
			let params = {
				teaHouseId: this.teaHouseId,
				startTime: dateTools.format(
					'yyyy-MM-dd 00:00:00',
					searchForm.date[0] || new Date(Date.now() - 30 * 24 * 3600 * 1000) // 三十天前
				),
				endTime: dateTools.format(
					'yyyy-MM-dd 00:00:00',
					searchForm.date[1] || new Date()
				),
				teaTableOrRoom: 'room',
				teaTableId: Number(searchForm.reserveType) === -1 ? '' : searchForm.reserveType,
				consumerPhone: searchForm.phone || '',
				way: searchForm.reserveMethond,
				state: this.state
			};
			params = Object.assign(params, {
				currentPage: currentPage,
				pageSize: 10
			});
			this.isTableLoading = true;
			this.$http
				.request(this, 'POST', '/reserveManage/reserveList', params)
				.then(res => {
					this.isTableLoading = false;
					console.log('reserve', res);
					if (res.data.errCode === '000000') {
						this.tableData = res.data.data.reserveOrder;
						console.log('tableData', res.data.data.reserveOrder);
						// this.pageTotal = data.result.total;
					} else {
						this.$Message.error({
							content: '出错了！'
						});
					}
				});
		},
		changePage (index) {
			this.getTableData(index);
		},
		getFeeBackValue (index) {
			let feeBackValue = {
				'-1': '线下预订',
				'1': '公众号预订退回',
				'2': '公众号预订并作为结账抵用'
			};
			return feeBackValue[index + ''];
		},
		search () {
			this.$refs['searchForm'].validate(validate => {
				if (validate) {
					this.getTableData();
				} else {
					this.$Message.error('请填写完整的查询信息');
				}
			});
		},
		open (row) {
			this.openForm = {
				typeTitle: '类型',
				type: '包间 - ' + row.name,
				number: row.peopleNum,
				chargeType: '0',
				comment: row.remark,
				reserveId: row.id,
				id: row.roomId
			};
			this.openModal = true;
		},
		openConfirm () {
			if (this.staff === '') {
				this.$Message.error('开台员工不能为空！');
				this.isloading = false;
			} else {
				let openForm = this.openForm;
				let postData = {
					teaTableOrRoom: 'room',
					type: 2,
					peopleNum: openForm.number,
					teaTableId: openForm.id,
					reserveId: openForm.reserveId,
					staffId: this.staff,
					chargeRuleId: openForm.chargeType
				};
				this.isloading = true;
				this.$http
					.request(this, 'POST', '/teaTable/setTableBegin', postData)
					.then(res => {
						this.isloading = false;
						if (res.data.errCode === '000000') {
							// 改为跳转到详情
							this.openModal = false;
							this.$Message.success('开台成功！');
							this.getTableData();
						} else {
							this.$Message.error(res.data.errMsg);
						}
					})
					.catch(err => {
						console.log(err);
						this.isloading = false;
					});
			}
		},
		reserve (row) {
			// 初始化弹窗默认数据
			let reserveForm = (this.reserveForm = {
				isReserveOnline: true,
				isFinished: false,
				isCanceled: false,
				isFeeBack: '',
				timePhase: dateTools.format('yyyy-MM-dd hh:mm', new Date(row.startTime)) + ' - ' + dateTools.format('hh:mm', new Date(row.endTime)),
				id: row.id,
				buyerId: row.buyerId,
				roomId: row.roomId,
				consumerName: row.consumerName,
				teaOrderId: row.orderId,
				comment: row.remark
			});
			reserveForm = Object.assign(reserveForm, row);

			const operationStaff = this.staffArr.find(item => item.value === row.staffId);
			reserveForm.operationStaff = operationStaff ? operationStaff.label : '';
			reserveForm.keepTime = row.keepTime ? (row.keepTime + '分钟') : '';

			const STATE = parseInt(row.state);
			const IS_FEE_BACK = parseInt(row.isFeeBack);
			if (STATE === 4) {
				reserveForm.isFinished = true;
				reserveForm.confirmTime = dateTools.format(
					'yyyy-MM-dd hh:mm',
					new Date(row.confirmTime)
				);
			} else if (STATE === 8) {
				reserveForm.isCanceled = true;
				reserveForm.cancelTime = dateTools.format(
					'yyyy-MM-dd hh:mm',
					new Date(row.cancelTime)
				);
			}

			if (IS_FEE_BACK === -1) {
				reserveForm.isReserveOnline = false;
			} else {
				reserveForm.isFeeBack = this.getFeeBackValue(IS_FEE_BACK);
			}
			this.reserveModal = true;
		},
		reserveCancel () {
			let form = this.reserveForm;
			const self = this;
			self.$Modal.confirm({
				title: '提示',
				closable: true,
				loading: true,
				content: '是否取消' + form.consumerName + '的订单?',
				onOk: function () {
					let httpParams = {
						teaHouseId: this.teaHouseId,
						reserveOrderId: form.id
					};
					self.$http
						.request(self, 'POST', '/reserveManage/reserveCancel', httpParams)
						.then(response => {
							let res = response.data;
							if (res.errCode == '000000') {
								self.reserveModal = false;
								self.$Message.success('取消成功');
								self.$Modal.remove();
								self.getTableData();
							} else {
								self.$Modal.remove();
								self.$Message.error({
									content: '[' + res.errCode + ']' + res.errMsg
								});
							}
						})
						.catch(error => {
							console.log(error);
						});
				}
			});
		}
	},
	created () {
		this.getTableData(); // 获取列表
		// this.getStaff();
		// this.getChargeRule();
		// this.getRoomList();
	},
	watch: {
		state: function () {
			this.current = 1;
			this.getTableData();
		}
	}
};
</script>
