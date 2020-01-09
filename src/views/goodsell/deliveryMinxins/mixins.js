import dateTools from '@/tools/dateTools';
let getStateStr = (state) => {
	let str = '';

	if (state === 1) {
		str = '未付款';
	} else if (state === 2) {
		str = '待发货';
	} else if (state === 3) {
		str = '已发货';
	} else if (state === 4 || state === 5) {
		str = '已完成';
	} else if (state === 7) {
		str = '退款/售后';
	} else if (state === 6) {
		str = '已关闭';
	}
	return str;
};

// let getPayWayStr = (payway) => {
// 	let str = '';
// 	switch (payway) {
// 	case 1:
// 		str = '现金';
// 		break;
// 	case 2:
// 		str = '微信支付';
// 		break;
// 	case 3:
// 		str = '支付宝';
// 		break;
// 	case 4:
// 		str = '会员卡';
// 		break;
// 	default:
// 		break;
// 	}
// 	return str;
// };

export default {
	data () {
		return {
			columns: [{
				title: '订单编号',
				key: 'orderId'
			}, {
				title: '商品名称',
				key: 'goodsName'
			}, {
				title: '下单时间',
				// key: 'createTime',
				width: 180,
				render: (h, params) => {
					return h('div', dateTools.format('yyyy-MM-dd hh:mm:ss', new Date(params.row.createTime)));
				}
			}, {
				title: '商品单价',
				key: 'unitPrice'
			}, {
				title: '商品数量',
				key: 'totalCount'
			}, {
				title: '订单总价格（运费）',
				key: 'totalPrice'
			}, {
				title: '买家信息',
				key: 'userInfo'
			}, {
				title: '状态',
				key: 'state',
				render: (h, params) => {
					return h('div', getStateStr(parseInt(params.row.state)));
				}
			}, {
				title: '订单操作',
				key: 'action',
				align: 'center',
				width: 200,
				render: (h, params) => {
					return h('div', [
						h(
							'Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {
									marginRight: '5px',
									visibility: (params.row.state === 2) ? 'inline-block' : 'hidden'
								},
								on: {
									click: () => {
										this.showSend(params.row);
									}
								}
							},
							(params.row.isRefunding === 1) ? '退款' : '发货'
						),
						h(
							'Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								on: {
									click: () => {
										this.showDetail(params.row);
									}
								}
							},
							'订单详情'
						)
					]);
				}
			}
			],
			refundGoodsCol: [
				{
					title: '商品名称',
					align: 'center',
					key: 'goodsName'
				}, {
					title: '数量',
					align: 'center',
					key: 'totalCount'
				}, {
					title: '单价',
					align: 'center',
					key: 'unitPrice'
				}, {
					title: '总价',
					align: 'center',
					key: 'totalPrice',
					width: 120
				}
			]
		};
	}
};
