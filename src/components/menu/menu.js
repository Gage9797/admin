export default {
	data () {
		return {
			gslAltCol: [
				{
					title: '分类',
					align: 'center',
					key: 'goodsClassifyName'
				}, {
					title: '名称',
					align: 'center',
					key: 'name'
				}, {
					title: '单价',
					align: 'center',
					key: 'price'
				}, {
					title: '库存',
					align: 'center',
					key: 'inventory'
				}, {
					title: '操作',
					align: 'center',
					key: 'action',
					width: 70,
					render: (h, params) => {
						return h('div', [
							h('i-button', {
								props: {
									size: 'small',
									type: 'primary',
									disabled: params.row.inventory <= 0
								},
								on: {
									click: () => {
										if (params.row.inventory > 0) {
											this.$store.commit('increGoods', {
												id: params.row.id,
												name: params.row.name,
												price: params.row.price
											});
										}
									}
								}
							}, '添加')
						]);
					}
				}
			],
			gslSelectedCol: [
				{
					title: '名称',
					align: 'center',
					key: 'name'
				}, {
					title: '单价',
					align: 'center',
					key: 'price'
				}, {
					title: '数量',
					align: 'center',
					key: 'counts',
					render: (h, params) => {
						return h('div', [
							h('Icon', {
								props: {
									size: 14,
									color: '#c3a451',
									type: 'android-remove-circle'
								},
								style: {
									'padding-right': '6px'
								},
								nativeOn: {
									click: () => {
										this.$store.commit('decreGoods', params.row.id);
									}
								}
							}),
							h('span', {
								style: {
									display: 'inline-block',
									width: '16px',
									height: '16px',
									textAlign: 'center'
								}
							}, params.row.count),
							h('Icon', {
								props: {
									size: 14,
									color: '#c3a451',
									type: 'android-add-circle'
								},
								style: {
									'padding-left': '6px'
								},
								nativeOn: {
									click: () => {
										this.$store.commit('increGoods', params.row);
									}
								}
							})
						]);
					}
				}, {
					title: '总价',
					align: 'center',
					key: 'sum',
					render: (h, params) => {
						let sum = Number(params.row.price) * params.row.count;
						return h('div', sum.toFixed(2));
					}
				}, {
					title: '操作',
					align: 'center',
					key: 'action',
					width: 70,
					render: (h, params) => {
						return h('div', [
							h('i-button', {
								props: {
									size: 'small',
									type: 'primary'
								},
								style: {
									marginRight: '0px'
								},
								on: {
									click: () => {
										this.$store.commit('deleGoods', params.row.id);
									}
								}
							}, '删除')
						]);
					}
				}
			]
		};
	}
};
