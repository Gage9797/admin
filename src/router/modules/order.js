import Main from '@/views/Main.vue';

const order = {
  path: '/order',
  name: 'order',
  icon: 'charts',
  title: '订单管理',
  component: Main,
  children: [
    {
        path: 'order',
        title: '订单管理',
        name: 'order',
        component: () =>
            import('@/views/order-list/index')
    }
  ]
};

export default order;