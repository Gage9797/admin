import Main from '@/views/Main.vue';

const orderManageMap = {
	path: '/orderManage',
	name: 'orderManage',
	icon: 'ios-paper-outline',
	title: '订单管理',
	component: Main,
	children: [
		{
			path: 'index', title: '订单管理', name: 'order_manage', component: () => import ('@/views/order-list/index.vue'),
			path: 'print', title: '订单打印', name: 'order_manage', component: () => import('@/views/order-list/components/print.vue')
		}
	]
};

export default orderManageMap;
