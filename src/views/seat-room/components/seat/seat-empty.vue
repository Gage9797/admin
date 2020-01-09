<style lang="less">
@import '../styles/common.less';

</style>

<template>
    <div class="seat-empty item">
        <i-row class="item-main">
            <i-col span="16" class="item-status">
                <span class="is-empty">空闲中</span>
            </i-col>
            <i-col span="8" class="item-name">
               <abbr :title="room.name">{{room.name}}</abbr>
            </i-col>
        </i-row>
        <i-row class="item-footer">
            <i-col span="24">
                <Button type="primary" @click="open">开台</Button>
            </i-col>
        </i-row>
    </div>
</template>


<script>
export default {
	name: 'emptySeat',
	inject: ['openHandler'],
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
				roomOrseat: 'seat',
				name: room.name,
				id: room.id
			});
		}
	},
	created () {

	}
};
</script>
