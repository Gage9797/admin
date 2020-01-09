import Main from '@/views/Main.vue';

import businessMap from './modules/business';
import order from './modules/order.js'
import stockMap from "./modules/stock.js";
import workerManageMap from './modules/worker.js';
import reportMap from './modules/report.js';
import settingsMap from './modules/settings.js';
import goodsellMap from './modules/goodsell.js';

/**
 * 不作为Main组件的子页面展示的页面单独写，如下
 */

// print
export const test = {
	path: '/print',
	name: 'print',
	meta: {
		title: 'print'
	},
	component: () => import('@/views/main-components/print')
}


// 非 admin 执行了 admin的操作
export const notAdminRouter = {
	path: '/notAdmin',
	name: 'notAdmin',
	meta: {
        title: '权限不足'
    },
    component: () => import('@/views/error-page/not-admin.vue')
}

// 协议
export const protocolRouter = {
	path: '/serviceProtocol',
	name: 'protocolSerive',
	meta: {
		title: '麒龙茶典智慧管家系统服务协议'
	},
	component: () => import('@/views/protocol/service')
}

// 支付页面
export const paymentRouter = {
	path: '/payment',
	name: 'payment',
	component: () => import('@/views/payment/index.vue'),
	children: [
		{
			path: 'wechat',
			name: 'paymentWechat',
			component: () => import('@/views/payment/wechat.vue')
		}, {

			path: 'ali',
			name: 'paymentAli',
			component: () => import('@/views/payment/ali.vue')

		}, {
			path: 'renew',
			name: 'renew',
			component: () => import('@/views/payment/renew.vue')
		}, {
			path: 'aliSuccess',
			name: 'paymentAliSuccess',
			component: () => import('@/views/payment/ali-success.vue')
		}
	]
}

// 入驻
export const locateRouter = {
	path: '/locate',
	name: 'locate',
	redirect: '/locate/houseInfo',
	component: () => import('@/views/locate/index.vue'),
	children: [
		{
			path: 'houseInfo',
			name: 'locateHouseInfo',
			meta: {
				step: 1
			},
			component: () => import('@/views/locate/house-info.vue')
		}, {
			path: 'qualification',
			name: 'locateQualification',
			meta: {
				step: 2
			},
			component: () => import('@/views/locate/qualification.vue')
		}, {
			path: 'payment',
			name: 'locatePayment',
			meta: {
				step: 3
			},
			component: () => import('@/views/locate/payment.vue')
		}, {
			path: 'audit',
			name: 'locateAudit',
			meta: {
				step: 4
			},
			component: () => import('@/views/locate/audit.vue')
		}
	]
}
// 忘记密码
export const forgetPasswordRouter = {
	path: '/forgetPassword',
	name: 'forgetPassword',
	component: () => import('@/views/forget-password/index.vue')
}
// 注册
export const registerRouter = {
	path: '/register',
	name: 'register',
	component: () => import('@/views/register/index.vue')
}
// 登录
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/login',
    component: Main,
    children: [
        { path: 'room/edit', meta: {notCache: true}, title: '包间编辑', name: 'room_edit', component: () => import('@/views/settings/room-edit.vue') },
        // { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        // { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/seat-room/index') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/self-space.vue') },
        // 旧的 { path: 'orderDetail/:order_id', title: '订单详情', name: 'order_detail', component: () => import('@/views/order-list/components/order-detail.vue') }, // 用于展示动态路由
		{ path: 'orderDetail',title: '订单详情', name: 'order_detail', component: () => import('@/views/order-list/components/order-detail.vue')},
		// 新的
		{ path: 'payOrder',title: '订单详情', name: 'pay_order', component: () => import('@/views/order-list/components/pay-order.vue')},
		{ path: 'deliveryDetail',title: '订单详情', name: 'delivery_detail', component: () => import('@/views/goodsell/deliveryDetail.vue')},
		{ path: 'settingAddGoods',title: '添加商品', name: 'setting_addGoods',component: () => import('@/views/settings/goods-add.vue') }, // 设置->商品管理->添加商品
        { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
		{ path: 'stock/item_detail/', title: '库存详情', name: 'item_detail', component: () => import('@/views/stock/item-detail.vue')},
		{ path: 'settings/notice/list', title: '商家微信端通知列表', name: 'businessWechatNoticeList', component: () => import('@/views/settings/notice/wechat-list.vue')},
		{ path: 'questionnaire', title: '问卷调查', name: 'questionnaire', component: () => import('@/views/questionnaire/index')},
		{ path: 'overtime', meta: {notCache: true}, name: 'overtime', component: () => import('@/views/overtime/index.vue') }
	]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	businessMap,
    order,
    stockMap,
    workerManageMap,
    reportMap,
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	test,
	notAdminRouter,
	protocolRouter,
	paymentRouter,
	locateRouter,
	forgetPasswordRouter,
	registerRouter,
    loginRouter,
    otherRouter,
    preview,
	locking,
    ...appRouter,
    page500,
    page403,
	page404
];
