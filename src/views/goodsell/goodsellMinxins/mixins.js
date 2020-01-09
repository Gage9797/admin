import dateTools from '@/tools/dateTools';
let getStateStr = (state, type) => {
	let str = '';
	if (state === 2 && type === 1) {
		str = '待确认';
	} else if ((state === 4 && type === 1) || (state === 5 && type === 1) || (state === 5 && type === 3)) {
		str = '已确认';
	}
	return str;
};
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
			goodsellOrder: [
				{ title: '订单编号', key: 'orderId', align: 'center' },
				{
					title: '下单时间',
					// key: 'createTime',
					align: 'center',
					render: (h, params) => {
						return h('div', dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(params.row.createTime)));
					}
				},
				{
					title: '商品数量',
					key: 'totalCount',
					align: 'center'
				},
				{
					title: '收费方式',
					key: 'payWay',
					align: 'center',
					render: (h, params) => {
						return h('div', getPayWayStr(params.row.payWay));
					}
				},
				{ title: '实收金额', key: 'totalPrice', align: 'center' },
				{
					title: '订单状态',
					key: 'state',
					align: 'center',
					render: (h, params) => {
						return h('div', getStateStr(params.row.state, params.row.type));
					}
				},
				{
					title: '订单操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h(
								'Button',
								{
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.checkOrder(params.row);
											// console.log(params.row);
										}
									}
								},
								'查看'
							),
							h(
								'Button',
								{
									props: {
										type: 'primary',
										size: 'small'
									},
									on: {
										click: () => {
											this.printTicket(params.row);
										}
									}
								},
								'打印'
							)
						]);
					}
				}
			],
			orderDetailCol: [
				{
					title: '名称',
					align: 'center',
					key: 'goodsName'
				}, {
					title: '数量',
					align: 'center',
					key: 'count'
				}, {
					title: '单价',
					align: 'center',
					key: 'price'
				}, {
					title: '总价',
					align: 'center',
					key: 'totalPrice'
				}, {
					title: '操作',
					align: 'center',
					key: 'action',
					width: 90,
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
											// maxCount: params.count
										};
										this.ifShowGoodsBack = true;
									}
								}
							},
							'退回商品')
						]);
					}
				}
			]
		};
	}
}
;
