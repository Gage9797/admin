import dateTools from '@/tools/dateTools';
import { formatPrice } from '@/tools';

let getPayWayStr = (index) => {
	let strArr = [
		'',
		'现金',
		'微信支付',
		'支付宝',
		'会员卡'
	];
	return strArr[index];
};

export default {
	data () {
		return {
			gsSellCol: [
				{
					title: '订单号',
					align: 'center',
					key: 'orderId'
				}, {
					title: '开单时间',
					align: 'center',
					key: 'createTime',
					render: (h, params) => {
						return h('div', dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(params.row.createTime)));
					}
				}, {
					title: '商品数量',
					align: 'center',
					key: 'totalCount'
				}, {
					title: '收费方式',
					align: 'center',
					key: 'payWay',
					render: (h, params) => {
						return h('div', getPayWayStr(params.row.payWay));
					}
				}, {
					title: '实收金额',
					align: 'center',
					key: 'totalPrice',
					render: (h, params) => h('span', formatPrice(params.row.totalPrice))
				}, {
					title: '操作',
					align: 'center',
					width: 150,
					key: 'action',
					render: (h, params) => {
						return h('div', [
							h('i-button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '20px'
								},
								on: {
									click: () => {
										this.detailData = {
											orderId: params.row.orderId,
											createTime: dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(params.row.createTime)),
											totalCount: params.row.totalCount,
											totalPrice: params.row.totalPrice,
											payWayStr: getPayWayStr(params.row.payWay),
											payWay: params.row.payWay,
											orderDetailData: params.row.teaShoppingOrderGoods,
											teaShoppingOrderGoods: params.row.teaShoppingOrderGoods,
											id: params.row.id
										};
										this.ifShowDetail = true;
									}
								}
							}, '查看'),
							h('i-button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									color: 'white'
								},
								on: {
									click: () => {
										this.printTicket(params.row);
									}
								}
							}, '打印')
						]);
					}
				}
			],
			ifShowDetail: false,
			orderDetailCol: [
				{
					title: '商品名称',
					align: 'center',
					key: 'goodsName'
				}, {
					title: '数量',
					align: 'center',
					key: 'count'
				}, {
					title: '单价',
					align: 'center',
					key: 'price',
					render: (h, params) => h('div', formatPrice(params.row.price))
				}, {
					title: '总价',
					align: 'center',
					key: 'sum',
					render: (h, params) => h('div', formatPrice(params.row.count * params.row.price))
				}, {
					title: '操作',
					key: 'action',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								on: {
									click: () => {
										this.goodsBackObj = {
											...params.row,
											index: params.index
										};
										this.ifShowGoodsBack = true;
									}
								}
							},
							'退回商品')
						]);
					}
				}
			],
			detailData: {
				orderDetailData: []
			}
		};
	}
};
