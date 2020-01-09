import Cookies from 'js-cookie';
import axios from 'axios'

const KEY_USER_NAME = 'user';
const KEY_TEA_HOUSE_NAME = 'teaHouseName';
const KEY_USER_PHTONE = 'phone';
const KEY_TOKEN = 'token';

const user = {
	state: {
		username: Cookies.get(KEY_USER_NAME),
		belongTo: Cookies.get(KEY_TEA_HOUSE_NAME),
		authority: null,

		appVersion: null,
		restTime: null,
		isAdmin: null,
		questionnaire: null,
		isFirstEnter: false,
		wxPayState: 0,	// 0: 没申请过，1：申请中，2：已开通
		aliPayState: 0
	},
	mutations: {
		logout (state) {
			Cookies.remove(KEY_USER_NAME);
			Cookies.remove(KEY_USER_PHTONE);
			Cookies.remove(KEY_TOKEN);
			state.authority = null;
		},
		setUserName (state, name) {
			state.username = name;
		},
		setTeaHouseName (state, name) {
			state.belongTo = name;
		},
		setUserAuth (state, auth) {
			state.authority = auth;
		},
		setAppVersion (state, appVersion) {
			state.appVersion = appVersion;
		},
		setIsAdmin (state, isAdmin) {
			state.isAdmin = isAdmin;
		},
		setRestTime (state, restTime) {
			state.restTime = restTime;
		},
		setQuestionnaire (state, questionnaire) {
			state.questionnaire = questionnaire;
		},
		setIsFirstEnter (state, isFirstEnter) {
			state.isFirstEnter = isFirstEnter;
		},
		setWxPayState (state, flag) {
			state.wxPayState = flag;
		},
		setAliPayState (state, flag) {
			state.aliPayState = flag;
		}
	},
	actions: {
		GetUserInfo ({ commit }, param) {
			return new Promise((resolve, reject) => {
				// axios.post('/mk_getUserInfo', param)
				// 	.then(res => {
				// 		console.log('12', res);
				// 		if (res.data.code === '200') {
				// 		// 	// 因为是利用用户的token获取这类信息，故而茶馆的信息绑定到了用户。
				// 			const data = res.result;
				// 		// 	commit('setUserName', data.userName);
				// 		// 	commit('setTeaHouseName', data.belongTo);
				// 		// 	commit('setAppVersion', data.appVersion);
				// 		// 	commit('setIsAdmin', data.isAdmin);
				// 		// 	commit('setRestTime', data.restTime);
				// 		// 	commit('setQuestionnaire', data.questionnaire);
				// 		// 	commit('setIsFirstEnter', data.isFirstEnter);
				// 		// 	commit('setWxPayState', data.wxPayState);
				// 		// 	commit('setAliPayState', data.aliPayState);

				// 		// 	Cookies.set(KEY_USER_NAME, data.userName);
				// 		// 	Cookies.set(KEY_TEA_HOUSE_NAME, data.belongTo);

							resolve('data');
				// 		} else {
				// 			commit('logout');
				// 			reject(new Error(res.errMsg));
				// 		}
				// 	})
				// 	.catch(err => {
				// 		reject(err);
				// 	});
			});
		},
		GetUserAuth ({ dispatch, getters }, param) {
			return new Promise((resolve, reject) => {
				if (getters.authority !== null) {
					resolve(getters.authority);
				} else {
					dispatch('UpdateUserAuth', param)
						.then(list => {
							resolve(list);
							// console.log(list);
						})
						.catch(err => {
							reject(err);
						});
				}
			});
		},
		UpdateUserAuth ({ commit }, param) {
			return new Promise((resolve, reject) => {
				axios.post('/mk_getAuth', param)
					.then(res => {
						if (res.data.code === '200') {
							console.log("res", res);
							// commit('setUserAuth', res.result.authList);
							// resolve(res.result.authList, res.result.noticeList);
							resolve(res)
						}
					})
					.catch(err => {
						reject(err);
					});
			});
		},
		GetAppInfo ({ state, dispatch }) {
			return new Promise((resolve, reject) => {
				if (state.appVersion !== null) {
					resolve({
						appVersion: state.appVersion,
						restTime: state.restTime,
						questionnaire: state.questionnaire,
						isAdmin: state.isAdmin,
						canUse: state.appVersion === 3 && state.restTime >= 0
					});
				} else {
					dispatch('GetUserInfo')
						.then(({ appVersion, restTime, questionnaire, isAdmin }) => {
							const canUse = appVersion === 3 && restTime >= 0;
							resolve({appVersion, restTime, questionnaire, isAdmin, canUse});
						})
						.catch(err => {
							reject(err);
						});
				}
			});
		}
	}
};

export default user;
