<style lang="less">
@import "../styles/common.less";

// .room-reserved {
//     background-color: #05a508;
// }
.brown-white-btn {
  background: white;
  border-color: #c3a451;
  color: #c3a451;
}
</style>

<template>
    <div class="room-reserved item">
       <i-row class="item-main">
            <i-col span="16" class="item-status">
                <div class="status-content">
                    <span class='title'>{{room.consumerName}} - 已预订</span><br>
                    <span class="sup">预订时间：{{room.reserveTime}}</span>
                </div>
            </i-col>
            <i-col span="8" class="item-name">
                <abbr :title="room.name">{{ room.name }}</abbr>
            </i-col>
        </i-row>
        <i-row class="item-footer">
			 <i-col span="12" class="item-left-btn">
                <Button type="primary" @click="open">开台</Button>
            </i-col>
            <i-col span="12" class="item-right-btn">
                <Button @click="cancelReserve" class="brown-white-btn">取消预订</Button>
            </i-col>
            <!-- <i-col span="12" class="item-left-btn">
                <Button type="primary" @click="reserveOpen">预订开台</Button>
            </i-col>
            <i-col span="12" class="item-right-btn">
                <Button @click="notReserveOpen" class="brown-white-btn">非预订开台</Button>
            </i-col> -->
        </i-row>
    </div>
</template>


<script>
import moment from 'moment';
export default {
	name: 'reservedRoom',
	inject: ['reserveHandler', 'openHandler', 'cancelTable'],
	props: {
		room: {
			type: Object,
			required: true,
			default: {
				name: '',
				reserveStartTime: ''
			}
		}
	},
	computed: {
		reservedTime () {
			let reserveTime = moment(this.room.reserveTime).format('YYYY-MM-DD hh:mm');
			return reserveTime;
		}
	},
	methods: {
		addZero (num) {
			return num > 9 ? num : '0' + num;
		},
		reserveOpen () {
			let room = this.room;
			this.openHandler({
				reserveId: room.reserveId,
				roomOrseat: 'room',
				openType: 2,	// 2为预订开台，3为非预订开台
				name: room.name,
				id: room.id
			});
		},
		notReserveOpen () {
			let room = this.room;
			this.openHandler({
				reserveId: room.reserveId,
				roomOrseat: 'room',
				openType: 3,
				name: room.name,
				id: room.id
			});
		},
		open () {
			let room = this.room;
			this.openHandler({
				openType: 1,
				roomOrseat: 'room',
				name: room.name,
				id: room.id,
				reserveId: room.reserveId
			}, true);
		},
		cancelReserve () {
			this.cancelTable(this.room);
		}
	}
};
</script>
