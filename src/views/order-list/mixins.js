import moment from 'moment';
import { formatPrice } from '@/tools';

let getStateStr = (state) => {
	let str = '已结账';

	if (state === 1 || state === 4) {
		str = '消费中';
	}

	return str;
};

let getPayWayStr = (payway) => {
	let str = '';
	switch (payway) {
		case 1:
			str = '现金';
			break;
		case 2:
			str = '微信支付';
			break;
		case 3:
			str = '支付宝';
			break;
		case 4:
			str = '会员卡';
			break;
		default:
			break;
	}
	return str;
};

export default {
	data () {
		return {
			columns: [{
				title: '订单编号',
				key: 'orderId',
				align: 'center'
			}, {
				title: '下单时间',
				key: 'createTime',
				render: (h, params) => {
					return h('div', moment(params.row.orderTime).format('YYYY-MM-DD hh:mm:ss'));
				}
			}, {
				title: '消费时长',
				key: 'consumeTime',
				render: (h, params) => {
					let endTime = null;
					if (params.row.state === '1' || params.row.state === '4') {
						// 消费中
						endTime = moment().format('YYYY-MM-DD HH:mm:ss');
					} else {
						endTime = params.row.endTime;
					}
					let H = moment(endTime).diff(moment(params.row.orderTime), 'hours');
					let M = moment(endTime).diff(moment(params.row.orderTime), 'minutes') % 60;
					console.log('M', endTime, params.row.orderTime);
					return h('div', `${H} 小时 ${M} 分钟`);
				}
			}, {
				title: '状态',
				key: 'state',
				render: (h, params) => {
					return h('div', getStateStr(parseInt(params.row.state)));
				}
			}, {
				title: '桌台类型',
				key: 'type',
				render: (h, params) => {
					if (params.row.roomId !== false) {
						return h('div', params.row.name);
					} else {
						return h('div', params.row.name);
					}
				}
			}, {
				title: '人数',
				key: 'peopleNum'
			}, {
				title: '操作员工',
				key: 'staff'
			}, {
				title: '应付金额',
				key: 'payment',
				render: (h, params) => {
					const payment = params.row.payment;
					if (payment === null) {
						return '';
					}
					return h('div', formatPrice(params.row.payment));
				}
			}, {
				title: '支付方式',
				key: 'payway',
				render: (h, params) => {
					console.log('params.row.payway', params.row.payway);
					if (params.row.state === '1') {
						return h('div', '');
					} else {
						return h('div', params.row.payway);
					}
					// return h('div', getPayWayStr(params.row.payway));
				}
			}, {
				title: '操作',
				key: 'action',
				width: 120,
				align: 'center',
				render: (h, params) => {
					if (params.row.state === '1' || params.row.state === '4') {
						return h('div', [
							h(
								'Button', {
									props: {
										type: 'primary',
										size: 'small'
									},
									on: {
										click: () => {
											this.$router.push({path: '/payOrder?orderId=' + params.row.orderId + '&roomName=' + params.row.name});
										}
									}
								},
								'去结账'
							)
						]);
					} else {
						return h('div', [
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
								'查看'
							)
						]);
					}
				}
			}]
		};
	}
};
