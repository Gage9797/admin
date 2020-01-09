import Main from '@/views/Main.vue';

const pickupMap = {
  path: '/pickup',
  name: 'pickup',
  icon: 'settings',
  title: '提货管理',
  component: Main,
  children: [
      { path: 'index', title: '提货', name: 'pickup_index', component: () => import('@/views/pickUp/index.vue') }
  ]
};

export default pickupMap;