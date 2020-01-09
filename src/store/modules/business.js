import Vue from 'vue';

let findIndex = (arr, id) => {
	let index = -1;
	arr.forEach((i, ii) => {
		if (i.id === id) {
			index = ii;
		}
	});

	return index;
};

export default {
	state: {
		goodsNum: 0,
		goodsSum: 0,
		gsl: [], // 左边的可选商品列表
		gslSelected: {}, // 右边的已选商品

		queryGoodsName: '', // 快递单号 查询
		queryOrderId: ''
	},
	getters: {
		gslAlt (state) {
			return state.gsl;
		},
		gslSelectedList (state) {
			const gsls = state.gslSelected;
			let arr = [];
			for (let i in gsls) {
				arr.push(gsls[i]);
			}
			return arr;
		},
		gslSelectedCount (state) {
			const gsls = state.gslSelected;
			let count = 0;
			for (let i in gsls) {
				count += gsls[i].count;
			}
			return count;
		},
		gslSelectedSum (state) {
			const gsls = state.gslSelected;
			let sum = 0;
			for (let i in gsls) {
				sum += (gsls[i].count * Number(gsls[i].price));
			}
			return sum.toFixed(2);
		},
		getQueryGoodsName (state) {
			return state.queryGoodsName;
		},
		getQueryOrderId (state) {
			return state.queryOrderId;
		}
	},
	mutations: {
		setGsl (state, payload) {
			Vue.set(state, 'gsl', payload.gsl);
		},
		increGoods (state, payload) {
			let id = payload.id;
			let index = findIndex(state.gsl, id);
			if (index !== -1 && state.gsl[index].inventory > 0) {
				if (typeof state.gslSelected['g_' + id] === 'undefined') {
					Vue.set(state.gslSelected, ['g_' + id], payload);
					Vue.set(state.gslSelected['g_' + id], 'count', 1);
				} else {
					state.gslSelected['g_' + id].count += 1;
				}
				state.gsl[index].inventory -= 1;
			}
		},
		decreGoods (state, id) {
			let index = findIndex(state.gsl, id);
			state.gslSelected['g_' + id].count -= 1;
			state.gsl[index].inventory += 1;

			if (state.gslSelected['g_' + id].count === 0) {
				Vue.delete(state.gslSelected, 'g_' + id);
			}
		},
		deleGoods (state, id) {
			let index = findIndex(state.gsl, id);
			let count = state.gslSelected['g_' + id].count;
			state.gsl[index].inventory += count;
			Vue.delete(state.gslSelected, 'g_' + id);
		},
		clearGslSelected (state) {
			state.gslSelected = {};
		},
		setBackGslSelected (state) {
			Object.keys(state.gslSelected).forEach((i) => {
				let index = findIndex(state.gsl, state.gslSelected[i].id);
				let count = state.gslSelected[i].count;
				state.gsl[index].inventory += count;
				Vue.delete(state.gslSelected, i);
			});
		},
		setQueryGoodsName (state, goodsName) {
			state.queryGoodsName = goodsName;
		},
		setQueryOrderId (state, orderId) {
			state.queryOrderId = orderId;
		}
	}
};
