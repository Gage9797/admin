<template>
  <div id="tables-index">
    <i-row :gutter="16">
      <i-col span="8" v-for="(room, index) in rooms" :key="index">
        <Card style="width:300px; height:120px; margin-bottom:20px;" v-bind:class="{ 'open-color': room.state===2, 'ordered-color': room.state===1 }">
          <div style="text-align:left">
            <i-col span="14">
              <h2>{{states[room.state-1]}}</h2>
              <br/>
              <h3 class="timeFont" v-if="room.state==2">时间：{{room.reserveStartTime.split(' ')[1]}}</h3>
              <h3 class="timeFont" v-if="room.state==3">时间：{{room.usingTime}}</h3>
            </i-col>
            <i-col span="8">
              <h3>{{room.name}}</h3>
              <br/>
              <i-button v-if="room.state!=3" @click="opening(room.state, room.id, 0)">开台</i-button>
              <i-button v-else @click="payment()">结账</i-button>
            </i-col>
          </div>
        </Card>
      </i-col>
      <i-col span="8" v-for="(teaTable, index) in teaTables" :key="index">
        <Card style="width:300px; height:120px; margin-bottom:20px;" v-bind:class="{ 'open-color': teaTable.state===2, 'ordered-color': teaTable.state===1 }">
          <div style="text-align:left">
            <i-col span="14">
              <h2>{{states[teaTable.state-1]}}</h2>
              <br/>
              <h3 class="timeFont" v-if="teaTable.state==2">时间：{{teaTable.reserveStartTime.split(' ')[1]}}</h3>
              <h3 class="timeFont" v-if="teaTable.state==3">时间：{{teaTable.usingTime}}</h3>
            </i-col>
            <i-col span="8">
              <h3>{{teaTable.name}}</h3>
              <br/>
              <i-button v-if="teaTable.state!=3" @click="opening(teaTable.state, teaTable.id, 1)">开台</i-button>
              <i-button v-else @click="payment()">结账</i-button>
            </i-col>
          </div>
        </Card>
      </i-col>

      <modal
        v-model="modal1"
        title="未开台"
        @on-ok="startTableNoOrder()"
        @on-cancel="cancel">
        <Form :model="formItem1" :label-width="80">
          <FormItem label="用 餐 人 数">
            <Input v-model="formItem1.num" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="预计时长/h">
            <Input v-model="formItem1.time" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
      </modal>

      <modal
        v-model="modal2"
        title="预约开台确认"
        @on-ok="startTableOrdered()"
        @on-cancel="cancel">
        <Form :model="formItem2" :label-width="80">
          <FormItem label="手 机 号 码">
            <Input v-model="formItem2.phone" placeholder="请输入预订人手机号..."></Input>
            <i-button @click="checkList">查询</i-button>
          </FormItem>
          <FormItem id="orderInfo" label="预 定 信 息">
            <select v-model="orderId">
              <option v-for="order in orders" v-bind:value="order.id">{{order.roomName}}--{{order.startTime}}</option>
            </select>
          </FormItem>
        </Form>
      </modal>

    </i-row>
  </div>
</template>

<script>
import objectTools from '@/tools/objectTools';
export default {
	name: 'tableIndex',
	data () {
		return {
			states: ['空闲中', '已预订', '已开台'],
			teaTables: [],
			rooms: [],
			modal1: false,
			modal2: false,
			formItem1: {
				num: '',
				time: ''
			},
			formItem2: {
				phone: ''
			},
			currentTable: {
				id: 0,
				type: 0
			},
			orders: [],
			orderId: 0
		};
	},

	methods: {
		/**
         * 获取当前茶位列表
         */
		getTableList () {
			let me = this;
			let teaHouseId = this.$util.getTeaHouseId();
			this.$http.request(this, 'GET', '/teaTable/getTeaTableList?teaHouseId=' + teaHouseId).then(function (response) {
				let res = response.data;
				me.teaTables = res.result.teaTableList;
				me.rooms = res.result.roomList;
			}).catch(function (error) {

			});
		},
		/**
         * 打开开台modal
         * @param state   此teaTable/room 状态
         * @param id      开台的teaTable/room id
         * @param type    开台的是room: 0, teaTable:1
         */
		opening (state, id, type) {
			console.log('opening' + state + id + type);
			this.currentTable.id = id;
			this.currentTable.type = type;
			if (state == 1) {
				this.modal1 = true;
			} else {
				this.modal2 = true;
			}
		},
		payment () {
			// confirm('暂无结账功能');
			const orderId = this.orderId;
			const index = 1;
			this.$router.push({path: `/order/${orderKeyId}?orderId=123`});
		},
		/**
         * 未预订茶位的开台
         */
		startTableNoOrder () {
			let me = this;
			if (me.currentTable.type == 0) {
				// 是room
				var params = {
					peopleNum: me.formItem1.num,
					roomId: me.currentTable.id,
					expectedTime: me.formItem1.time
				};
			} else {
				// 是teaTable
				var params = {
					peopleNum: me.formItem1.num,
					tableId: me.currentTable.id,
					expectedTime: me.formItem1.time
				};
			}
			this.$http.request(this, 'POST', '/teaTable/businessBegin', params).then(function (response) {
				let res = response.data;
				console.log(res);
				me.getTableList();
				me.formItem1 = {
					num: '',
					time: ''
				};
				this.$Message.info('开台成功');
			}).catch(function (error) {

			});
		},
		checkList () {
			let me = this;
			// 获取预订列表
			let params = {
				consumerPhone: me.formItem2.phone
			};
			this.$http.request(this, 'POST', '/teaTable/getReserveOrderOutlineList', params).then(function (response) {
				console.log('res', response.data.result);
				me.orders = response.data.result;
				// document.getElementById("orderInfo").innerHTML = JSON.stringify(response.data.result);
			}).catch(function (error) {

			});
		},
		/**
         * 已预订茶位的开台
         */
		startTableOrdered () {
			console.log(this.orderId);
			let me = this;

			if (me.currentTable.type == 0) {
				// 是room
				var param = {
					isPreserved: true, // 是否已预订（必选）
					reserveOrderId: this.orderId,
					roomId: me.currentTable.id
				};
			} else {
				// 是teaTable
				var param = {
					isPreserved: true, // 是否已预订（必选）
					reserveOrderId: this.orderId,
					tableId: me.currentTable.id
				};
			}

			this.$http.request(this, 'POST', '/teaTable/businessBegin', param).then(function (response) {
				let res = response.data;
				console.log(res);
				me.getTableList();
				me.formItem2 = {
					phone: ''
				};
				me.orders = [];
				this.$Message.info('开台成功');
			}).catch(function (error) {

			});
		},
		cancel () {
			this.$Message.info('Clicked cancel');
		}
	},

	mounted () {
		this.getTableList();
	}
};
</script>

<style lang="less">
.timeFont {
    font-size: 10px;
}
.open-color {
  background-color: #E8F8F5;
}
.ordered-color {
  background-color: #FDEBD0;
}
.free-color {

}
</style>
