import dateTools from '@/tools/dateTools.js';
import { formatPrice } from '@/tools';

const STATE = {
	reserved: '3',
	finished: '4',
	canceled: '8'
};

export default {
	data () {
		return {
			tableColumns: [
				{ title: '客户名', key: 'consumerName' },
				{ title: '客户电话', key: 'phone' },
				// { title: '预约编号', key: 'orderId' },
				{
					title: '预订类型',
					key: 'name',
					render: (h, params) => {
						return h('span', '包间 - ' + params.row.typeTitle);
					}
				}, {
					title: '预约时间段',
					key: 'timePhase',
					render: (h, params) => {
						// let s = dateTools.format('yyyy-MM-dd hh:mm', new Date(params.row.startTime));
						// let e = dateTools.format('hh:mm', new Date(params.row.endTime));
						return h('div', params.row.date);
					}
				}, {
					title: '预订方式',
					key: 'reserveMethod',
					render: (h, params) => {
						const isFeeBack = parseInt(params.row.isFeeBack);
						let str = '';
						switch (isFeeBack) {
							case -1:
								str = '线下预订';
								break;
							case 1:
							case 2:
								str = '公众号预订';
								break;
							default:
						}
						return h('div', '线下预订');
					}
				}, {
					title: '定金',
					key: 'fee',
					render: (h, params) => h('div', formatPrice(params.row.fee))
				}, {
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						if (this.state === STATE.reserved && !params.row.isUsing) {
							return h('div', [
								h(
									'Button',
									{
										props: { type: 'primary', size: 'small' },
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.reserve(params.row);
											}
										}
									},
									'查看'
								),
								h(
									'Button', {
										props: {
											type: 'primary',
											size: 'small'
										},
										on: {
											click: () => {
												this.open(params.row);
											}
										}
									},
									'开台'
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
												this.reserve(params.row);
											}
										}
									},
									'查看'
								)
							]);
						}
					}
				}
			]
		};
	}
};
