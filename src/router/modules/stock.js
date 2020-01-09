import Main from '@/views/Main.vue';

const goodsMap = {
  path: '/stock',
  name: 'stock',
  icon: 'stock',
  title: '商品',
  component: Main,
  children: [
      { path: 'goods-list', title: '商品列表', name: 'goods-list', component: () => import('@/views/stock/goods-list.vue')},
      // { path: 'into-warehouse', title: '商品入库', name: 'into-warehouse', component: () => import('@/views/stock/into-warehouse.vue')},
      // { path: 'out-warehouse', title: '商品出库', name: 'out-warehouse', component: () => import('@/views/stock/out-warehouse.vue') }
  ]
};

export default goodsMap;
