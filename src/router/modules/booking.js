import Main from '@/views/Main.vue';

const bookingMap = {
  path: '/booking',
  name: 'booking',
  icon: 'bookmark',
  title: '预约管理',
  component: Main,
  children: [
      { path: 'index', title: '预约管理', name: 'booking_index', component: () => import('@/views/booking/index.vue') }
  ]
};

export default bookingMap;