<style lang="less">
@import "../../../styles/common.less";
@import "../advanced-router.less";
</style>

<template>
	<div>
		<Row class="menu-wrap">
			<Card>
				<p slot="title">
						<Icon type="compose"></Icon>
						订单详情
				</p>
				<div class="info">
						<p>订单 编号： {{orderId}}</p>
						<p>包间/台号： {{subId}}</p>
						<p>消费 时间： {{consumeTime}}</p>
						<div class="go-back-btn">
								<Button type="primary" size="large" @click="goBack">返回列表</Button>
						</div>
				</div>
				<Table :columns="order_col" :data="order_data" height="600"></Table>
			</Card>
		</Row>
		<Row class="margin-top-10">
			<div class="btn-wrap">
				<Button type="primary" size="large" @click="add">加 菜</Button>
				<Button type="primary" size="large" @click="pay">结 账</Button>  
			</div>
		</Row>


		<modal 
			v-model="modal"
			title="菜单"
			width="900"
			@on-ok="ok"
      		@on-cancel="cancel">

			<Row type="flex" class="modal-row">
				<Col span="6">
					<Menu active-name="0" mode="vertical" @on-select='menuSelect' width="80%">
						<MenuItem v-for="(item, index) in menu" :name="index" :key="index" >
							{{item.type}}
						</MenuItem>
					</Menu>
				</Col>
				<Col span="10">
					<Table :columns="menu_col" :data="getMenuData" height='420'></Table>
				</Col>

				<Col span="8">
					<Card>
						<p slot="title">已选商品</p>
						<Table :columns="goods_selected_col" :data="goodsSelected" height='300'></Table>
						<p class="total">￥{{getTotal}}</p>
					</Card>
				</Col>
			</Row>
		</modal>

		<Modal
      v-model="modalOfPayConfirm"
      title="确认结账"
      @on-ok="modalOfPayOk"
      @on-cancel="modalOfPayCancel">
      <p v-html="modalConfirmMsg"></p>
    </Modal>
	</div>
</template>

<script>
import expandRow from './expandRow.vue';
import dateTool from '@/tools/dateTools';

export default {
	name: 'order-info',
	components: {
		expandRow
	},
	data () {
		return {
			orderId: '',
			order_id: '',
			subId: '',
			consumeTime: '',
			order_name: '',
			order_time: '',

			showInfo: false,
			order_col: [
				{
					title: '商品名称',
					key: 'goodsName',
					align: 'center'
				},
				{
					title: '数量',
					key: 'num',
					align: 'center'
				},
				{
					title: '情况',
					key: 'status',
					align: 'center',
					render: (h, params) => {
						// console.log(params.row.status);
						let status = params.row.status;
						if (!status) {
							return h('div', [
								h(
									'checkbox',
									{
										props: {
											size: 'small'
										},
										on: {
											'on-change': () => {
												this.change(params.index);
											}
										}
									},
									['未上齐']
								)
							]);
						} else {
							return h('div', [
								'已上齐'
							]);
						}
					}
				},
				{
					title: '金额',
					key: 'price',
					align: 'center'
				}
			],
			order_data: [],

			modal: false,
			menu: [
				{
					type: '茶水',
					list: [
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						},
						{
							name: '铁观音',
							price: 300,
							num: 0
						}
					]
				},
				{
					type: '零食',
					list: [
						{
							name: '零食1',
							price: 100,
							num: 0
						}
					]
				},
				{
					type: '香烟',
					list: [
						{
							name: '香烟1',
							price: 100,
							num: 0
						}
					]
				},
				{
					type: '啤酒',
					list: [
						{
							name: '啤酒1',
							price: 100,
							num: 0
						}
					]
				}
			],
			goodsSelected: [],
			menuTypeIndex: 0,
			menu_col: [
				{
					title: '商品',
					key: 'name',
					align: 'center'
				},
				{
					title: '价格',
					key: 'price',
					align: 'center'
				},
				{
					title: '添加',
					key: 'num',
					align: 'center',
					render: (h, params) => {
						let num = params.row.num;
						return h('div', [
							h(
								'Icon',
								{
									props: {
										type: 'android-remove-circle',
										size: 16,
										color: '#2d8cf0'
									},
									style: {
										padding: '0 8px 0 0'
									},
									on: {
										click: () => {
											this.menuGoodsRemove(params.index, params.row.num);
										}
									}
								}
							),
							num,
							h(
								'Icon',
								{
									props: {
										type: 'android-add-circle',
										size: 16,
										color: '#2d8cf0'
									},
									style: {
										padding: '0 0 0 8px'
									},
									on: {
										click: () => {
											this.menuGoodsAdd(params.index, params.row.num);
										}
									}
								}
							)
						]);
					}
				}
			],
			goods_selected_col: [
				{
					title: '商品',
					key: 'goods',
					align: 'center',
					render: (h, params) => {
						let row = params.row;
						let goodsName = this.menu[row.typeIndex].list[row.listIndex].name;
						return h('div', [goodsName]
						);
					}
				},
				{
					title: '数量',
					key: 'num',
					align: 'center',
					render: (h, params) => {
						let row = params.row;
						let num = this.menu[row.typeIndex].list[row.listIndex].num;
						return h('div', [num]);
					}
				},
				{
					title: '金额',
					key: 'num',
					align: 'left',
					render: (h, params) => {
						let row = params.row;
						let num = this.menu[row.typeIndex].list[row.listIndex].num;
						let price = this.menu[row.typeIndex].list[row.listIndex].price;
						let sum = parseInt(num) * parseInt(price);
						return h('div', ['￥' + sum]
						);
					}
				}
			],

			modalOfPayConfirm: false,
			modalConfirmMsg: '',
			isPaymentConfirmNeeded: null

		};
	},
	computed: {
		getMenuData () {
			return this.menu[this.menuTypeIndex].list;
		},
		getTotal () {
			let menu = this.menu;
			let total = 0;
			this.goodsSelected.forEach((x) => {
				let item = menu[x.typeIndex].list[x.listIndex];
				total += parseInt(item.num) * parseInt(item.price);
			});
			return total;
		}
	},
	methods: {
		init () {
			this.orderId = this.$route.query.orderId;
			this.order_id = parseInt(this.$route.params.order_id);

			const self = this;
			let tempOrderData = null;
			this.$http
				.request(this, 'POST', '/teaOrder/getTeaOrderDetail', {orderKeyId: self.order_id})
				.then(res => {
					console.log(res);
					if (res.data.errCode === '000000') {
						let data = res.data.result;
						self.subId = data.detailTitle.tableId || data.detailTitle.roomId;
						self.order_data = data.goodsList;
						self.consumeTime = dateTool.format('yyyy-MM-dd hh:mm', new Date(data.detailTitle.orderTime));

						data.goodsList.forEach(i => {
							tempOrderData = {
								goodsName: i.goodsName,
								num: i.num,
								status: i.status,
								price: i.price
							};
							self.order_data.push(tempOrderData);
						});

						tempOrderData = null;
					}
				})
				.catch(err => {
					console.log(err);
				});
			// this.order_data = [order];
			// this.order_data = [order];
		},
		initMunu () {
			console.log(this.$http);
			this.$http
				.request(this, 'GET', 'http://test.gzqlwk.com/TeaHouse/goods/getGoodsClassifyList?teaHouseId=1')
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		clearBasket () {
			this.menu.forEach(x => {
				x.list.forEach(y => {
					y.num = 0;
				});
			});
		},
		goBack () {
			this.$router.push({path: '/orderManage/index'});
		},
		add () {
			this.$Message.info('add');
			this.modal = true;
		},
		pay () {
			this.$http
				.request(this, 'POST', '/teaOrder/getPayment', {
					orderKeyId: this.order_id
				})
				.then(res => {
					let data = res.data;
					let result = data.result;
					if (data.errCode === '000000') {
						this.modalOfPayConfirm = true;
						if (result.isPaid) {
							this.modalConfirmMsg = '用户已线上结账';
							this.isPaymentConfirmNeeded = {
								ifNeed: false
							};
						} else {
							this.modalConfirmMsg = `订单金额 ￥ <span style="color: red;">${result.payment}</span> 元，请收到用户结账金额后确定。`;
							this.isPaymentConfirmNeeded = {
								ifNeed: true,
								data: {
									orderKeyId: this.order_id,
									payment: result.payment,
									totalPrice: result.totalFee
								}
							};
						}
					}
				})
				.catch(err => {
					console.error(err);
					this.$Message.info('出现故障了');
				});
		},
		change (index) {
			// http request....
			this.order_data[index].status = true;
		},
		ok () {
			console.log('ok');
		},
		cancel () {
			console.log('cancel');
		},
		menuSelect (name) {
			this.menuTypeIndex = parseInt(name);
		},
		menuGoodsRemove (index, num) {
			let typeIndex = this.menuTypeIndex;
			if (num > 0) {
				if (--this.menu[typeIndex].list[index].num === 0) {
					this.goodsSelected = this.goodsSelected.filter(x => !(x.typeIndex === typeIndex && x.listIndex === index));
					console.log(this.goodsSelected);
				}
			}
		},
		menuGoodsAdd (index, num) {
			if (++this.menu[this.menuTypeIndex].list[index].num === 1) {
				this.goodsSelected.push({
					typeIndex: this.menuTypeIndex,
					listIndex: index
				});
				console.log(this.goodsSelected);
			}
		},
		modalOfPayOk () {
			if (this.isPaymentConfirmNeeded.ifNeed) {
				this.$http.request(this, 'POST', '/teaOrder/payTheBill', this.isPaymentConfirmNeeded.data)
					.then(res => {
						if (res.data.errCode === '000000') {
							console.log(res);
						} else {
							this.$Message.error('确认结账失败');
						}
					})
					.catch(err => {
						this.$Message.info('确认结账失败');
					});
			}
		},
		modalOfPayCancel () {

		}
	},
	mounted () {
		this.init();
		this.initMunu();
	},
	activated () {
		this.init();
		this.clearBasket();
	}
};
</script>

<style lang="less" scoped>
.info {
  position: relative;
  margin-bottom: 12px;

  .go-back-btn {
    position: absolute;
    bottom: 0;
    right: 0;
		// transform: translateY(-50%);
		
		Button {
			width: 86px;
		}
  }
}
.btn-wrap {
	padding-right: 16px;
	text-align: right;

	Button {
		width: 86px;
		margin-left: 20px;
	}
}
.modal-row {
	height: 420px;
}
.total {
	font-size: 20px;
	line-height: 36px;
}
</style>
