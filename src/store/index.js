import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import business from './modules/business';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		business,
		app,
		user
	},
	getters,
	state: {
		room: [],
		userInfo: []
	},
	mutations: {
		setRoom (state, param) {
			state.room = param;
		},
		setUserInfo (state, param) {
			state.userInfo = param;
		}
	}
});

export default store;
