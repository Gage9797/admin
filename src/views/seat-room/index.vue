<style lang="less" scoped>
@import '../../styles/common.less';

.select-wrapper{
	position: absolute;
	top: 22px;
	right: 18px;
	z-index: 1;
}
.ctrl-bar {
	padding-top: 10px;
    margin-bottom: 20px;
    &-btn {
        float: left;
        .refresh {
            float: right;
            margin-left: 20px;
            &:hover {
                cursor: pointer;
            }
        }
    }
    &-select {
        float: right;
        margin-right: 50px;
    }
}
.container {
	display: flex;
	justify-content: space-around;
}
.list-wrap {
    margin-bottom: 40px;
    padding-left: 20px;
    padding-right: 20px;
    .list-title{
      width: 90%;
      font-size: 18px;
      color: rgb(93,85,60);
      padding-bottom: 10px;
      border-bottom: 1px solid rgb(150,150,150);
      margin-bottom: 20px;
    }
    .list {
        display: flex;
        flex-wrap: wrap;

        li {
            width: 30%;
            margin-right: 3%;
            margin-bottom: 3%;
            background: rgb(235,235,233);
            border: 1px solid rgb(235,235,233);
            border-radius: 10px;
            /deep/ .new-for-border{
              border: 1px solid rgb(235,235,233);
            }
        }
    }
}
.btn {
	margin-left: 45%;
}
.modal-content-type {
	word-break: break-all;
}


/deep/ .ivu-select-single .ivu-select-selection{
	// background: rgb(210,210,210);
	border-radius: 12px;
	text-align: center;
}
/deep/ .ivu-select-item{
	text-align: center
}

/deep/ .ivu-input{
  background:rgb(235,235,233);
  display: inline-block;
}
/deep/ .ivu-select-selection{
  background:rgb(235,235,233);
}
/deep/ .ivu-form-item-label{
  color: rgb(95,95,95);
  font-size: 14px;
  text-align-last: justify;
  padding: 10px 8px;
}
/deep/ .ivu-input-number-input{
  background:rgb(235,235,233);
  display: inline-block;
}
/deep/ .ivu-form-item-content{
  color: rgb(95,95,95);
  font-size: 14px;
}

</style>

<template>
    <div id="seat-room-list">
		<div class="select-wrapper">
            <Select style="width: 100px;" v-model="status">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        <header class="ctrl-bar clearfix">
          <Tabs type="card" v-model="listType">
            <TabPane label="全部"  name="all" class="ql-tab-pane">
              <div class="list-wrap">
                <p class="list-title">包间</p>
                <ul class="list">
                    <template v-for="(room, index) in curRoomList">
                        <li :key="room.key" v-if="room.status === 0">
                            <empty-room :room="room" class="new-for-border"/>
                        </li>
                        <li :key="index" v-if="room.status === 1">
                            <reserved-room :room="room" class="new-for-border"/>
                        </li>
                        <li :key="index" v-if="room.status === 2">
                            <using-room :room="room" :goodsList="goodsList" class="new-for-border"/>
                        </li>
                    </template>
                </ul>
              </div>
              <div class="list-wrap">
                <p class="list-title">散座</p>
                <ul class="list">
                    <template v-for="(room, index) in curSeatList">
                        <li :key="room.key" v-if="room.status === 0">
                            <empty-seat :room="room" class="new-for-border"/>
                        </li>
                        <li :key="index" v-if="room.status === 2">
                            <using-seat :room="room" :goodsList="goodsList" class="new-for-border"/>
                        </li>
                    </template>
                </ul>
              </div>
            </TabPane>
            <TabPane label="包间"  name="room"  class="ql-tab-pane">
              <div class="list-wrap">
                <p class="list-title">包间</p>
                <ul class="list">
                    <template v-for="(room, index) in curRoomList">
                        <li :key="room.key" v-if="room.status === 0">
                            <empty-room :room="room" class="new-for-border"/>
                        </li>
                        <li :key="index" v-if="room.status === 1">
                            <reserved-room :room="room" class="new-for-border"/>
                        </li>
                          <li :key="index" v-if="room.status === 2">
                            <using-room :room="room" :goodsList="goodsList" class="new-for-border"/>
                        </li>
                    </template>
                </ul>
              </div>
            </TabPane>
            <TabPane label="散座"  name="seat"  class="ql-tab-pane">
              <div class="list-wrap">
                <p class="list-title">散座</p>
                <ul class="list">
                    <template v-for="(room, index) in curSeatList">
                        <li :key="room.key" v-if="room.status === 0">
                            <empty-seat :room="room" class="new-for-border"/>
                        </li>
                        <li :key="index" v-if="room.status === 2">
                            <using-seat :room="room" :goodsList="goodsList" class="new-for-border"/>
                        </li>
                    </template>
                </ul>
              </div>
            </TabPane>
          </Tabs>
        </header>

        <!-- 弹窗的开始 = =.. -->
        <!-- 开台 modal -->
        <Modal
            v-model="openModal"
            title="开台"
            ok-text="确认开台"
            @on-ok="openConfirm"
            @on-cancel="reset">
            <Form :model="openForm" label-position="left" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem :label="openForm.typeTitle">
							<span class="modal-content-type">{{ openForm.type }}</span>
						</FormItem>
					</Col>
					<Col span="10" offset="2">
						<FormItem label="人数">
							<InputNumber :precision="0" :min="1" :max="1024" v-model="openForm.number" style="width: 100%;" />
						</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
						<FormItem label="开台员工">
							<Select v-model="staff">
								<Option v-for="(s, index) in staffArr" :key="index" :value="s.name">{{ s.name }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="10" offset="2" v-if="openForm.isReservedRoom">
						<FormItem label="开台方式">
							<Select v-model="openForm.reservedRoomOpenType" style="width: 100%;">
								<Option value="2">预定开台</Option>
								<Option value="3">非预定开台</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>

                <!-- <FormItem label="计费设定" v-show="!isOpenRoom">
                    <Select v-model="openForm.chargeType" style="width:40%;">
                        <Option v-for="c in chargeList" :key="c.value" :value="c.value">{{c.label}}</Option>
                    </Select>
                </FormItem> -->
                <!-- <FormItem label="留言" @click="selectMenu">
                   <Row>
					   <Col span="24">
					    	<Input type="textarea" v-model="openForm.comment" :maxlength="100" style="width: 100%;" />
					   </Col>
                   </Row>
                </FormItem> -->
				<i-button type="primary" @click="selectMenu" class="btn">请选择菜单</i-button>
                <FormItem label="已选:">
                    <div v-for="(item,index) in goodsMenu" :key="index">
						<span>{{item.goodName}}</span> X <span>{{item.goodCode}}</span>
					</div>
                </FormItem>
            </Form>
		</Modal>
		<!-- 选择菜单 -->
		<Modal
        v-model="modal1"
        title="选择商品菜单"
        @on-ok="ok"
        @on-cancel="cancel">
		<CheckboxGroup v-model="menu" class="container">
			<div class="left">
				<div>商品</div>
				<div v-for="item in goodsList" :key="item.id">
					<Checkbox :label="item.id">{{item.goodName}}</Checkbox>
				</div>
			</div>
			<div class="right">
				<div>数量</div>
				<div v-for="item in goodsList" :key="item.id">
					<input v-model="item.goodCode" style="width: 30px;height: 17px;text-algin:center;">
				</div>
			</div>
    	</CheckboxGroup>
		<span v-for="item in goodsMenu" :key="item.id">{{item.goodName}}X{{item.goodCode}};</span>
    	</Modal>
		<Modal
			:visible.sync="openModal"
			title="普通的Modal对话框标题"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form :model="openForm" label-position="left" :label-width="80">
				<Row>
					<Col span="12">
						<FormItem :label="openForm.typeTitle">
							<span class="modal-content-type">{{ openForm.type }}</span>
						</FormItem>
					</Col>
					<Col span="10" offset="2">
						<FormItem label="人数">
							<InputNumber :precision="0" :min="1" :max="1024" v-model="openForm.number" style="width: 100%;" />
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Modal>
        <!-- 预订 modal -->
        <Modal
            v-model="reserveModal"
            title="预订"
            @on-ok="reserveConfirm"
            @on-cancel="reserveCancel">
            <Form ref="reserveForm" :model="reserveForm" label-position="left" :label-width="80" :rules="reserveFormRules">
				<Row>
					<Col span="24">
						<FormItem :label="reserveForm.typeTitle">
							<span>{{ reserveForm.type }}</span>
							<!-- <Input v-model="reserveForm.type" disabled style="width: 80%;" /> -->
						</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
						<FormItem label="顾客名" prop="consumerName">
							<i-input v-model="reserveForm.consumerName" :maxlength="30" style="width: 80%" />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="联系方式" prop="phone">
							<i-input v-model="reserveForm.phone" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="人数">
							<InputNumber :precision="0" :min="1" :max="1024" v-model="reserveForm.number" style="width: 80%" />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="预定员工" prop="reservationStaff">
							<Select v-model="reserveForm.reservationStaff" style="width: 80%;">
								<Option v-for="s in staffArr" :key="s.name" :value="s.name">{{ s.name }}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
                <FormItem label="预约时间" prop="timerange">
                    <i-row>
                        <Col span="8">
                            <DatePicker type="date" v-model="reserveForm.date" :options="datePickerOpts" @on-change="reserveDateChange" />
                        </Col>
						<Col span="1">
							<div style="text-align: center;">--</div>
						</Col>
                        <Col span="13">
                            <TimePicker ref="timepick" type="timerange" :steps="[1, 30, 0]" format="HH:mm"  hide-disabled-options v-model="reserveForm.timerange"></TimePicker>
							<!-- <Time-picker type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></Time-picker> -->
						</Col>
                    </i-row>
                </FormItem>
				<Row>
					<Col span="12">
						<FormItem label="保留时长">
							<InputNumber :min="0" :max="1440" v-model="reserveForm.keepTime" style="width: 80%; height: 32px;"/> 分钟
						</FormItem>
					</Col>
				</Row>
                <FormItem label="留言" @click="selectMenu">
                    <Row>
						<Col span="22">
							<Input v-model="reserveForm.comment" type="textarea" :maxlength="100" style="width:100%;" />
						</Col>
                    </Row>
                </FormItem>
            </Form>
			<div slot="footer">
				<Button type="text" @click="reserveCancel">取消</Button>
                <Button type="primary" @click="reserveConfirm">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import dateTools from '@/tools/dateTools';
import roomItem from './components/room';
import seatItem from './components/seat';
import QlTimePicker from './components/ql-time-picker';
import moment from 'moment';

export default {
	provide: function () {
		return {
			reserveHandler: this.reserveHandler,
			openHandler: this.openHandler,
			checkIfSetBusinessterm: this.checkIfSetBusinessterm,
			cancelTable: this.cancelTable
		};
	},
	data () {
		const validePhone = (rule, value, callback) => {
			var re = /^1[0-9]{10}$/;
			if (!value) {
				callback(new Error('手机号码不可为空'));
			} else if (!re.test(value)) {
				callback(new Error('手机格式错误'));
			} else {
				callback();
			}
		};
		return {
			goodsMenu: [],
			modal1: false,
			goodsList: [],
			menu: [],
			listType: 'all',
			status: 3,
			statusList: [
				{
					value: 0,
					label: '空闲中'
				}, {
					value: 1,
					label: '已预订'
				}, {
					value: 2,
					label: '使用中'
				}, {
					value: 3,
					label: '全部状态'
				}
			],

			listData: {
				roomList: [],
				seatList: []
			},
			staff: '',
			reservationStaff: '',
			staffArr: [],
			chargeList: [],
			chargeRule: {
				room: [],
				table: []
			},
			businessStartTimestamp: -1,
			businessEndTimestamp: -1,

			isOpenRoom: true,
			employeeName: '',
			openModal: false,
			openForm: {
				typeTitle: '类型',
				type: '',
				number: 2,
				chargeType: '0',
				comment: '',
				isReservedRoom: false,
				reservedRoomOpenType: '2'
			},

			reserveModal: false,
			reserveForm: {
				typeTitle: '类型',
				type: '',
				number: 2,
				comment: '',
				consumerName: '',
				phone: '',
				date: '',
				timerange: [],
				reserveList: [],
				keepTime: 30,
				reservationStaff: ''
			},
			reserveFormRules: {
				reservationStaff: {
					validator: (rule, value, callback) => {
						if (value === '') {
							callback(new Error('请先选择开台员工'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				},
				timerange: {
					validator: (rule, value, callback) => {
						if (!this.reserveForm.date || value.length === 0) {
							callback(new Error('请选择预定时间'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				},
				consumerName: {
					validator: (rule, value, callback) => {
						if (value.trim() === '') {
							callback(new Error('顾客名不可为空'));
						} else {
							callback();
						}
					},
					trigger: 'blur'
				},
				phone: [
					{ validator: validePhone, trigger: 'blur' }
				]
			},
			datePickerOpts: {
				disabledDate (date) {
					const now = Date.now();
					return (
						date.valueOf() < now - 24 * 60 * 60 * 1000 || // 今天之前的
						date.valueOf() > now + 29 * 24 * 60 * 60 * 1000 // 30天之后的
					);
				}
			}

		};
	},
	watch: {
		menu () {
			this.goodsMenu = [];
			this.menu.forEach(item => {
				this.goodsList.forEach(itm => {
					if (itm.id === item) {
						this.goodsMenu.push(itm);
						console.log('itm', itm);
					}
				});
			});
		},
		goodsList () {
			this.goodsMenu = [];
			this.menu.forEach(item => {
				this.goodsList.forEach(itm => {
					if (itm.id === item) {
						this.goodsMenu.push(itm);
						console.log('itm', itm);
					}
				});
			});
		}
	},
	computed: {
		curRoomList () {
			if (this.status === 3) {
				// console.log('this.listData.roomList', this.listData.roomList)
				return this.listData.roomList;
			}
			return this.listData.roomList.filter(item => {
				return item.status === this.status;
			});
		},
		curSeatList () {
			if (this.status === 3) {
				return this.listData.seatList;
			}
			return this.listData.seatList.filter(item => {
				return item.status === this.status;
			});
		},
		ifShowRoom () {
			const listType = this.listType;
			return listType === 'all' || listType === 'room';
		},
		ifShowSeat () {
			const listType = this.listType;
			return listType === 'all' || listType === 'seat';
		},
		nowDayIndex () {
			if (this.reserveForm.date === '') {
				return -1;
			}
			const ONE_DAY_MILLISECENDS = 24 * 60 * 60 * 1000;
			const toDayTimes = (new Date()).setHours(0, 0);
			const reserveDateTimes = this.reserveForm.date.getTime();
			const dis = reserveDateTimes - toDayTimes;
			if (dis < 0 || dis < (ONE_DAY_MILLISECENDS / 2)) {
				return 0;
			}
			return Math.ceil(dis / ONE_DAY_MILLISECENDS);
		}
	},
	components: {
		QlTimePicker,
		...seatItem,
		...roomItem
	},
	methods: {
		getgoodsList () {
			this.$http.request(this, 'POST', '/goods/goodsList').then((res) => {
				if (res.data.errCode === '000000') {
					this.goodsList = res.data.data.goodsList;
					console.log(this.goodsList);
				}
			});
		},
		selectMenu () {
			this.modal1 = true;
		},
		ok () {
			this.modal1 = false;
		},
		cancel () {
			this.modal1 = false;
		},
		refresh () {
			// clear all first
			this.listData = {
				roomList: [],
				seatList: []
			};
			this.getListData();
		},
		reset () {
			// this.staff = '';
			this.openForm.chargeType = '';
			this.openForm.comment = '';
			this.openForm.number = 2;
		},
		getStaff () {
			this.$request.post('/teaTable/tableStaff', {})
				.then(res => {
					if (res.errCode === '000000') {
						this.staffArr = res.data.staffList;
						console.log('this.staffArr', this.staffArr);
					}
				});
		},
		getListData () {
			this.$request.post('/teaTable/getTeaTableList', {})
				.then(res => {
					if (res.errCode === '000000') {
						// console.log('table', res)
						// const data = res.data.result;
						const ROOM = res.data.roomlist;
						const SEAT = res.data.teaTableList;

						// this.staffArr = data.staff;
						// this.staff = data.staff[0] ? data.staff[0].value : '';

						// this.chargeRule = data.chargeRule;
						// this.businessStartTimestamp = data.businessHoursStart === null ? -1 : data.businessHoursStart; // 防止后台传回来麻瓜数据
						// this.businessEndTimestamp = data.businessHoursEnd === null ? -1 : data.businessHoursEnd; // 防止后台传回来麻瓜数据

						let list = this.listData;
						let temp = null;
						ROOM.forEach((item, index) => {
							temp = item;
							temp.key = 'r_' + item.id;
							// temp.status = 0;

							// if (typeof item.usingTime !== 'NULL') { // is using now
							// 	temp.status = 1;
							// } else if (typeof item.reserveTime !== 'undefined') { // is reserved but not being using
							// 	temp.status = 2;
							// }
							list.roomList.push(temp);
						});

						SEAT.forEach((item, index) => {
							temp = item;
							temp.key = 's_' + item.id;
							// temp.status = 0;
							// if (typeof item.usingTime !== 'undefined') { // is using now
							// 	temp.status = 1;
							// }
							list.seatList.push(temp);
						});

						temp = {};
						// console.log('roomlist', list.roomList);
						// console.log('seatList', list.seatList);
					}
				});
		},
		openHandler (opt, isReservedRoom = false) {
			if (typeof opt !== 'object') {
				throw new TypeError('opt must be object');
			}

			let openForm = this.openForm;
			this.openForm.name = opt.name;
			this.openForm.id = opt.id;
			if (opt.roomOrseat === 'room') {
				this.isOpenRoom = true;
				// this.chargeList = this.chargeRule.room;
				openForm.type = opt.name;
				openForm.teaTableOrRoom = 'room';
			} else {
				this.isOpenRoom = false;
				this.chargeList = this.chargeRule.table;
				openForm.type = opt.name;
				openForm.teaTableOrRoom = 'table';
			}

			openForm.reserveId = opt.reserveId || '';
			openForm.openType = opt.openType || -1;
			openForm.teaTableId = opt.id || -1;
			openForm.isReservedRoom = isReservedRoom;

			this.openModal = true;
		},
		openConfirm () {
			let openForm = this.openForm;
			let postData = {
				state: '1',
				payway: '微信支付',
				payment: '',
				orderTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				endTime: '',
				type: openForm.isReservedRoom ? openForm.reservedRoomOpenType : openForm.openType,
				peopleNum: openForm.number,
				staff: this.staff,
				comment: openForm.comment,
				id: openForm.id,
				name: openForm.type,
				goods: JSON.stringify(this.goodsMenu)
			};
			console.log('openForm.name.', openForm.name);
			if (openForm.name.indexOf('包间') !== -1) {
				postData.roomId = openForm.id;
				postData.tableId = false;
			} else {
				postData.tableId = openForm.id;
				postData.roomId = false;
			}
			this.reset();
			this.$http.request(this, 'POST', '/teaTable/setTableBegin', postData)
				.then(res => {
					if (res.data.errCode === '000000') {
						// 改为跳转到详情
						// 加一个loading属性
						this.$Message.success('开台成功!');
						this.refresh();
					} else {
						this.$Message.error(`${res.data.errMsg}`);
					}
				});
		},
		checkIfSetBusinessterm () {
		},
		// 打开预定弹窗
		reserveHandler (opt = {}) {
			let reserveForm = this.reserveForm;
			reserveForm.type = opt.name;
			reserveForm.teaTableOrRoom = 'room';
			reserveForm.reserveId = opt.reserveId || '';
			reserveForm.openType = opt.openType || 1;
			reserveForm.id = opt.id || 1;
			reserveForm.reserveList = opt.reserveList || [];
			reserveForm.date = new Date((new Date()).setHours(0, 0));
			reserveForm.timerange = [];
			this.reserveModal = true;
		},
		// 预定弹窗确认
		reserveConfirm () {
			this.$refs['reserveForm'].validate((valid) => {
				if (!valid) {
					return;
				}

				let reserveForm = this.reserveForm;
				let postData = {
					consumerName: reserveForm.consumerName,
					phone: reserveForm.phone,
					number: reserveForm.number,
					typeTitle: reserveForm.typeTitle,
					date: moment(reserveForm.date).format('YYYY-MM-DD') + ' ' + reserveForm.timerange[0] + '-' + reserveForm.timerange[1],
					keepTime: reserveForm.keepTime,
					reservationStaff: reserveForm.reservationStaff,
					fee: '10',
					id: reserveForm.id
				};

				this.$http.request(this, 'POST', '/reserveManage/reserveBuild', postData)
					.then(res => {
						this.reserveCancel();
						if (res.data.errCode === '000000') {
							this.$Message.success('预订成功！');
							this.refresh();
						} else {
							this.$Message.error(res.data.errMsg);
						}
					});
			});
		},
		reserveCancel () {
			this.reserveModal = false;
			this.$refs['reserveForm'].resetFields();
			this.reserveForm.comment = '';
		},
		getFormatTime (date, time) {
			// emmmm: date 是一个日期，time是一个时间点。
			let d = dateTools.format('yyyy-MM-dd', date);
			let t = dateTools.format('hh:mm:ss', time);
			return d + ' ' + t;
		},
		reserveDateChange (a, b) {
			this.reserveForm.timerange = [];
		},
		cancelTable (opt) {
			this.$request.post('/reserveManage/cancelReverse', {id: opt.id})
				.then(res => {
					if (res.errCode === '000000') {
						this.$Message.success('取消预订成功！');
						this.refresh();
					}
				});
		}
	},
	created () {
		this.getStaff();
		this.getListData();
		this.getgoodsList();
	}
};
</script>
