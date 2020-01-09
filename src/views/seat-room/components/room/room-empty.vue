<style lang="less">
@import '../styles/common.less';
.brown-white-btn{
  background: white;
  border-color: #c3a451;
  color: #c3a451;
}
</style>

<template>
    <div class="room-empty item">
        <i-row class="item-main">
            <i-col span="16" class="item-status">
                <span class="is-empty">空闲中</span>
            </i-col>
            <i-col span="8" class="item-name">
                <abbr :title="room.name">{{room.name}}</abbr>
            </i-col>
        </i-row>
        <i-row class="item-footer">
            <i-col span="12" class="item-left-btn">
                <Button type="primary" @click="open">开台</Button>
            </i-col>
            <i-col span="12" class="item-right-btn">
                <Button @click="reserve" class="brown-white-btn">预订</Button>
            </i-col>
        </i-row>
    </div>
</template>


<script>
export default {
	name: 'emptyRoom',
	inject: ['reserveHandler', 'openHandler', 'checkIfSetBusinessterm'],
	props: {
		room: {
			type: Object,
			required: true,
			default: {
				name: ''
			}
		}
	},
	methods: {
		open () {
			let room = this.room;
			this.openHandler({
				openType: 1,
				roomOrseat: 'room',
				name: room.name,
				id: room.id
			});
		},
		reserve () {
			// this.checkIfSetBusinessterm()
			// 	.then(() => {
			let room = this.room;
			this.reserveHandler({
				reserveId: room.reserveId,
				openType: 1,
				roomOrseat: 'room',
				name: room.name,
				id: room.id,
				reserveList: room.reserveList
			});
			// })
			// .catch(err => {
			// 	console.log(err);
			// });
		}
	}
};
</script>
