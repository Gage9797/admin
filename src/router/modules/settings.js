import Main from '@/views/Main.vue';

const settingsMap ={
  path: '/settings',
  name: 'settings',
  icon: 'setting',
  title: '设置',
  component: Main,
  children: [
    {
      path: 'home',
      title: '首页设置',
      name: 'home_page_settings',
      component: () => import('@/views/settings/home-page-settings.vue')
    },
    {
      path: 'room',
      title: '包间设置',
      name: 'room_settings',
      component: () => import('@/views/settings/room-settings.vue')
    },
    {
      path: 'seats',
      title: '散座设置',
      name: 'seats_settings',
      component: () => import('@/views/settings/seats-settings.vue')
    },
    {
      path: 'charge',
      title: '计费设置',
      name: 'charge_settings',
      component: () => import('@/views/settings/charge-settings.vue')
    },
    {
      path: 'notice',
      title: '通知设置',
      name: 'notice_settings',
      component: () => import('@/views/settings/notice')
    },
    {
      path: 'category',
      title: '类目管理',
      name: 'category_index',
      component: () => import('@/views/settings/category-settings.vue')
    },
    {
      path: 'goods',
      title: '商品管理',
      name: 'goods_index',
      component: () => import('@/views/settings/goods-settings.vue') 
    }
  ]
}

export default settingsMap;
