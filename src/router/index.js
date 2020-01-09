import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import Store from '../store';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
	routes: routers
};

export const router = new VueRouter(RouterConfig);

// 路由白名单：注册、忘记密码、非管理员403、错误404、服务协议、登录。
const whilteListReg = /(register)|(forgetPassword)|(notAdmin)|(error)|(protocol)|(login)|(test)/;

// 只有超管能进入的页面：入驻、问卷、续费、支付，并且是在不计过期时间的情况下。
const adminRouterReg = /(locate)|(questionnaire)|(renew)|(payment)/;

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();
	Util.title(to.meta.title);

	/**
	 * modified by yoto at 2019-9-23 14:52
	 * refactory router controll because of the missing default page
	 */
	next();
	// const hasToken = Cookies.get('token');
	// console.log('hasToken', hasToken);
	// if (!hasToken) {
	// 	// not in login
	// 	if (whilteListReg.test(to.name)) {
	// 		next();
	// 	} else {
	// 		next({ name: 'login', replace: true });
	// 		iView.LoadingBar.finish();
	// 	}
	// } else {
	// 	// in login
	// 	if (Cookies.get('locking') === '1') {
	// 		// wanna to lock page：1 => yes。
	// 		if (to.name !== 'locking') {
	// 			next({ name: 'locking', replace: true });
	// 			iView.LoadingBar.finish();
	// 		} else {
	// 			next();
	// 		}
	// 	} else if (Cookies.get('locking') === '0' && to.name === 'locking') {
	// 		next(false);
	// 		iView.LoadingBar.finish();
	// 	} else {
	// 		next();
	// check system info
	// Store.dispatch('GetAppInfo')
	// 	.then(({ appVersion, restTime, isAdmin }) => {
	// 		if (adminRouterReg.test(to.name)) {
	// 			// only can admin into
	// 			if (isAdmin) {
	// 				next();
	// 			} else {
	// 				next({ name: 'notAdmin', replace: true });
	// 				iView.LoadingBar.finish();
	// 			}
	// 		} else if (restTime < 0) {
	// 			// 正常业务开始前 先检查 应用服务 是否已经过期。
	// 			// （1、2、 3 => 试用、审核、入驻）。服务已经过期了，那么只能进入过期页面。
	// 			if (to.name === 'overtime') {
	// 				next();
	// 			} else {
	// 				next({ name: 'overtime', replace: true });
	// 				iView.LoadingBar.finish();
	// 			}
	// 		} else {
	// 			// normal bussiness code
	// 			// pull data if refresh
	// Store.dispatch('UpdateMenulist')
	// 	.then(defaultPage => {
	// 		if (to.name === 'login') {
	// 			// const defaultPage = Store.getters.defaultPage;
	// 			if (from.path === defaultPage || from.path.indexOf(defaultPage) !== -1) {
	// 				next(false);
	// 			} else {
	// 				next({ path: defaultPage, replace: true });
	// 			}
	// 			return iView.LoadingBar.finish();
	// 		} else {
	// 			const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
	// 			// 已经登录且前往的是是在左侧菜单展示的页面
	// 			if (curRouterObj && curRouterObj.accessable === true) {
	// 				Util.toDefaultPage([...routers], to.name, router, next);
	// 			} else if (curRouterObj && curRouterObj.accessable === false) {
	// 				router.replace({
	// 					name: 'error-403'
	// 				});
	// 			} else {
	// 			// 不需要判断权限的路由
	// 				Util.toDefaultPage([...routers], to.name, router, next);
	// 			}
	// 		}
	// 	})
	// 	.catch(err => {
	// 		iView.Message.erro(err.message);
	// 	});
	// }
	// 	})
	// 	.catch(err => {
	// 		iView.Message.error(err.message);
	// 		next({
	// 			name: 'login',
	// 			replace: true
	// 		});
	// 	});
	// }

	// 白名单, 任何情况都可以进入的页面;
	// if (whilteListReg.test(to.name)) {
	// 	if (to.name === 'login' && Cookies.get('token')) {
	// 		// 如果进入的为登录页，且存在token，那么直接到首页。
	// 		// 进入首页的时候会有token有效性验证，如果无效则清除并跳转到登录页。
	// 		if (from.name === 'home_index') {
	// 			next(false);
	// 			iView.LoadingBar.finish();	// 因为没有进入下一个路由，所以不会有after钩子。
	// 		} else {
	// 			next({
	// 				replace: true,
	// 				name: 'home_index'
	// 			});
	// 		}
	// 	} else {
	// 		next();
	// 	}
	// } else if (!Cookies.get('token')) {
	// 	// 下边的页面需要保证在 有效登录态 下。
	// 	if (from.name === 'login') {
	// 		next(false);
	// 		iView.LoadingBar.finish();
	// 	} else {
	// 		next({
	// 			name: 'login'
	// 		});
	// 	}
	// } else if (Cookies.get('locking') === '1') {
	// 	// 再检查是不是要进行 锁着：1 => yes。
	// 	if (to.name !== 'locking') {
	// 		next({
	// 			replace: true,
	// 			name: 'locking'
	// 		});
	// 		iView.LoadingBar.finish();
	// 	} else {
	// 		next();
	// 	}
	// } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
	// 	next(false);
	// 	iView.LoadingBar.finish();
	// } else {
	// 	// 并且需要对 系统信息 进行校验。
	// Store.dispatch('GetAppInfo')
	// 	.then(({appVersion, restTime, isAdmin}) => {
	// 		if (adminRouterReg.test(to.name)) {
	// 			// 只有超管能进入的页面
	// 			if (isAdmin) {
	// 				next();
	// 			} else {
	// 				next({
	// 					replace: true,
	// 					name: 'notAdmin'
	// 				});
	// 			}
	// 		} else if (restTime < 0) {
	// 			// 正常业务开始前 先检查 应用服务 是否已经过期。
	// 			// （1、2、 3 => 试用、审核、入驻）。服务已经过期了，那么只能进入过期页面。
	// 			if (to.name === 'overtime') {
	// 				next();
	// 			} else {
	// 				next({
	// 					replace: true,
	// 					name: 'overtime'
	// 				});
	// 				iView.LoadingBar.finish();
	// 			}

	// 		// } else if (Cookies.get('locking') === '1' && to.name !== 'locking') {
	// 		// 	// 再检查是不是 锁着：1 => 锁着。
	// 		// 	next({
	// 		// 		replace: true,
	// 		// 		name: 'locking'
	// 		// 	});
	// 		// } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
	// 		// 	next(false);
	// 		// 	iView.LoadingBar.finish();
	// 		} else {
	// 			// 页面刷新需要重新拉取权限数据。
	// 			Store.dispatch('GetUserAuth')
	// 				.then(res => {
	// 					const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
	// 					// 已经登录且前往的是是在左侧菜单展示的页面
	// 					if (curRouterObj && curRouterObj.accessable === true) {
	// 						Util.toDefaultPage([...routers], to.name, router, next);
	// 					} else if (curRouterObj && curRouterObj.accessable === false) {
	// 						router.replace({
	// 							name: 'error-403'
	// 						});
	// 					} else {
	// 						// 不需要判断权限的路由
	// 						Util.toDefaultPage([...routers], to.name, router, next);
	// 					}
	// 				})
	// 				.catch(err => {
	// 					iView.Message.erro(err.message);
	// 				});
	// 		}
	// 	})
	// 	.catch(err => {
	// 		iView.Message.error(err.message);
	// 		next({
	// 			name: 'login',
	// 			replace: true
	// 		});
	// 	});
	// }
});

router.afterEach((to) => {
	Util.openNewPage(router.app, to.name, to.params, to.query);
	iView.LoadingBar.finish();
	window.scrollTo(0, 0);
});
