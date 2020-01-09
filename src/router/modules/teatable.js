import Main from '@/views/Main.vue';

const teatableMap = {
  path: '/teatable',
  name: 'teatable',
  icon: 'coffee',
  title: '茶位管理',
  component: Main,
  children: [
      { path: 'index', title: '茶位管理', name: 'tea_table_index', component: () => import('@/views/tea-table/index.vue') }
  ]
};

export default teatableMap;