<style lang="less">
@import '../styles/common.less';

</style>

<template>
    <div class="item">
        <i-row class="item-main">
            <i-col span="16" class="item-status">
                <div class="status-content">
                    <span class='title'>正在消费</span><br>
                    <span class="sup">入座时长：{{usingTime}}</span>
                </div>
            </i-col>
            <i-col span="8" class="item-name">
                <abbr :title="room.name">{{ room.name }}</abbr>
            </i-col>
        </i-row>
        <i-row class="item-footer">
            <i-col span="12" class="item-left-btn">
                <Button type="primary" @click="add">增加</Button>
            </i-col>
            <i-col span="12" class="item-right-btn">
                <Button @click="pay" class="brown-white-btn">结账</Button>
            </i-col>
        </i-row>
		<Modal
        v-model="modal1"
        title="选择新增商品菜单"
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
    </div>
</template>


<script>
export default {
	name: 'usingSeat',
	props: {
		room: {
			type: Object,
			required: true,
			default: {
				name: '',
				price: 0,
				usingTime: ''
			}
		},
		goodsList: {
			type: Array
		}
	},
	data () {
		return {
			price: 0,
			modal1: false,
			menu: [],
			goodsMenu: []
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
		usingTime () {
			let now = new Date();
			let begin = new Date(this.room.usingTime);
			let dis = parseInt((now - begin) / 1000);
			let hour = this.addZero(parseInt(dis / 3600));
			let minu = this.addZero(parseInt(((dis % 3600) / 60)));
			return hour + '小时' + minu + '分钟';
		}
	},
	methods: {
		addZero (num) {
			return (num > 9 ? '' + num : '0' + num);
		},
		add () {
			this.modal1 = true;
		},
		pay () {
			this.$store.commit('setRoom', this.room);
			this.$router.push({path: '/payOrder?orderId=' + this.room.orderId});
		},
		ok () {
			this.modal1 = false;
			this.$request.post('/teaOrder/modifyOrder', {goodsMenu: this.goodsMenu, orderId: this.room.orderId})
				.then(res => {
					if (res.data.errCode === '000000') {
						console.log(res.data.data.modifyOrder);
					}
				});
		},
		cancel () {
			this.modal1 = false;
		}
	}
};
</script>
