import { otherRouter, appRouter } from '@/router/router';
import Util from '@/libs/util';
import Vue from 'vue';

const app = {
	state: {
		ifNeedMsgListUpdateFlag: false,	// 消息列表
		ifNeedMsgTipUpdateFlag: false,	// 铃铛
		ifNeedMsgGoodsellUpdataFlag: false, // 门店订单
		ifNeedMsgDeliveryUpdataFlag: false, // 快递订单
		deliveryUpdata: {},
		goodsellUpdate: {},
		cachePage: [],
		lang: '',
		isFullScreen: false,
		openedSubmenuArr: [], // 要展开的菜单数组
		themeColor: '',
		pageOpenedList: [],
		currentPageName: '',
		currentPath: [], // 面包屑数组
		menuList: [],
		defaultPage: '/403',
		routers: [
			otherRouter,
			...appRouter
		],
		tagsList: [...otherRouter.children],
		messageCount: 0,
		// 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
		dontCache: ['text-editor', 'artical-publish'],
		// 是否刷新侧边菜单栏的显示，解决侧边菜单滑动效果不佳的问题
		resetSideMenu: false,
		isSitVersion: false
	},
	mutations: {
		setIfNeedMsgListUpdateFlag (state, flag) {
			state.ifNeedMsgListUpdateFlag = flag;
		},
		setIfNeedMsgTipUpdateFlag (state, flag) {
			state.ifNeedMsgTipUpdateFlag = flag;
		},
		// 门店订单刷新
		setIfNeedMsgGoodsellUpdataFlag (state, flag) {
			state.ifNeedMsgGoodsellUpdataFlag = flag;
			if (!flag) {
				state.goodsellUpdate = {};
			}
		},
		setGoodsellUpdate (state, data) {
			state.goodsellUpdate = data;
		},
		// 快递订单刷新
		setIfNeedMsgDeliveryUpdataFlag (state, flag) {
			state.ifNeedMsgDeliveryUpdataFlag = flag;
			if (!flag) {
				state.deliveryUpdata = {};
			}
		},
		setDeliveryUpdata (state, data) {
			state.deliveryUpdata = data;
		},

		setMenuList (state, list) {
			state.menuList = list;
		},
		setDefaultPage (state, path) {
			state.defaultPage = path;
		},
		setTagsList (state, list) {
			state.tagsList.push(...list);
		},
		addOpenSubmenu (state, name) {
			let hasThisName = false;
			let isEmpty = false;
			if (name.length === 0) {
				isEmpty = true;
			}
			if (state.openedSubmenuArr.indexOf(name) > -1) {
				hasThisName = true;
			}
			if (!hasThisName && !isEmpty) {
				state.openedSubmenuArr.push(name);
			}
		},
		closePage (state, name) {
			state.cachePage.forEach((item, index) => {
				if (item === name) {
					state.cachePage.splice(index, 1);
				}
			});
		},
		initCachepage (state) {
			if (localStorage.cachePage) {
				state.cachePage = JSON.parse(localStorage.cachePage);
			}
		},
		removeTag (state, name) {
			state.pageOpenedList.map((item, index) => {
				if (item.name === name) {
					state.pageOpenedList.splice(index, 1);
				}
			});
		},
		pageOpenedList (state, get) {
			let openedPage = state.pageOpenedList[get.index];
			if (get.argu) {
				openedPage.argu = get.argu;
			}
			if (get.query) {
				openedPage.query = get.query;
			}
			state.pageOpenedList.splice(get.index, 1, openedPage);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		clearAllTags (state) {
			state.pageOpenedList.splice(1);
			state.cachePage.length = 0;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		clearOtherTags (state, vm) {
			let currentName = vm.$route.name;
			let currentIndex = 0;
			state.pageOpenedList.forEach((item, index) => {
				if (item.name === currentName) {
					currentIndex = index;
				}
			});
			if (currentIndex === 0) {
				state.pageOpenedList.splice(1);
			} else {
				state.pageOpenedList.splice(currentIndex + 1);
				state.pageOpenedList.splice(1, currentIndex - 1);
			}
			let newCachepage = state.cachePage.filter(item => {
				return item === currentName;
			});
			state.cachePage = newCachepage;
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
		},
		setOpenedList (state) {
			state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
		},
		setCurrentPath (state, pathArr) {
			state.currentPath = pathArr;
		},
		setCurrentPageName (state, name) {
			state.currentPageName = name;
		},
		setAvator (state, path) {
			localStorage.avatorImgPath = path;
		},
		switchLang (state, lang) {
			state.lang = lang;
			Vue.config.lang = lang;
		},
		clearOpenedSubmenu (state) {
			state.openedSubmenuArr.length = 0;
		},
		setMessageCount (state, count) {
			state.messageCount = count;
		},
		increateTag (state, tagObj) {
			if (!Util.oneOf(tagObj.name, state.dontCache)) {
				state.cachePage.push(tagObj.name);
				localStorage.cachePage = JSON.stringify(state.cachePage);
			}
			state.pageOpenedList.push(tagObj);
			localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
			// console.log(state.dontCache);
		},
		resetMenu (state) {
			if (state.resetSideMenu) {
				state.resetSideMenu = false;
			} else {
				state.resetSideMenu = true;
			}
		}
	},
	actions: {
		UpdateMenulist ({ dispatch, commit, getters, state }, param) {
			return new Promise((resolve, reject) => {
				let menuList = [];
				// appRouter 所有定义的菜单栏（即超级管理员可以看的所有页面）

				// 给appRouter中的菜单栏打标签
				if (param.role === '普通员工' && appRouter[3].title === '员工管理') {
					appRouter.splice(3, 1);
				}
				console.log('appRouter', appRouter);
				appRouter.forEach((routerItem) => {
					routerItem.accessable = true;
					routerItem.children.forEach((child) => {
						child.accessable = true;
					});
				});
				// dispatch('GetUserAuth', param)
				// 	.then(list => {
				/**
					 * TODO: 优化
					 */
				console.log('123');
				// console.log(list);
				// list.forEach(authItem => {
				// 	let routeItem = appRouter.find(route => route.title === authItem.name);
				// 	if (!routeItem) {
				// 		return false;
				// 	}
				// 	routeItem.accessable = true;
				// 	if (routeItem.children.length === 1) {
				// 		routeItem.children[0].accessable = true;
				// 	} else if (routeItem.children.length > 1) {
				// 		routeItem.children.forEach((routerChild) => {
				// 			authItem.children.forEach((authChild) => {
				// 				if (routerChild.title === authChild.name) {
				// 					routerChild.accessable = true;
				// 				}
				// 			});
				// 		});
				// 	}
				// });
				console.log(appRouter);
				appRouter.forEach((item, index) => {
					let temp = JSON.parse(JSON.stringify(item));
					if (temp.accessable === true) {
						if (temp.children.length === 1) {
							menuList.push(temp);
						} else {
							let len = menuList.push(temp);
							let childrenArr = [];
							childrenArr = temp.children.filter(child => {
								if (child.accessable === true) {
									return child;
								}
							});
							menuList[len - 1].children = childrenArr;
						}
					}
				});
				console.log('menuList', menuList);
				commit('setMenuList', menuList);
				if (menuList[0]) {
					// 每一个模块至少会有一个 children 选项，其第一个选项作为 默认路由。（需要连接起完整path！！）
					const parentPath = menuList[0].path;
					const childPath = menuList[0].children[0].path;
					commit('setDefaultPage', `${parentPath}/${childPath}`);
					// console.log('state.defaultPage', state.defaultPage)
				} else {
					commit('setDefaultPage', '/403');
				}
				resolve(state.defaultPage);
			})
				.catch(err => {
					reject(err);
					console.log(err);
				});
			// });
		}
	}
};

export default app;
