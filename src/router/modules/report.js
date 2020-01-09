import Main from '@/views/Main.vue';
import test from '@/views/report/real-time/index.vue';

const reportMap = {
  path: '/report',
  name: 'report',
  icon: 'charts',
  title: '报表',
  component: Main,
  children: [{
  //   path: 'realtime',
  //   title: '实时报表',
  //   name: 'realTimeReport',
  //   component: () => import('@/views/report/real-time/index.vue')
  // }, {
    path: 'goods',
    title: '商品报表',
    name: 'goodsReport',
    component: () => import('@/views/report/goods/index.vue')
  }, {
    path: 'revenue',
    title: '营收报表',
    name: 'revenueReport',
    component: () => import('@/views/report/revenue/index.vue')
  // }, {
  //   path: 'staff',
  //   title: '员工报表',
  //   name: 'staffReport',
  //   component: () => import('@/views/report/staff/index.vue')
  }]
};

export default reportMap;
