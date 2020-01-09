import Main from '@/views/Main.vue';

const goodsellMap = {
  path: '/goodsell',
  name: 'goodsell',
  icon: 'goodsell',
  title: '商售',
  component: Main,
  children: [
      { path: 'sell-order',
        title: '门店订单',
        name: 'sell-order',
        component: () => import('@/views/goodsell/sellOrder.vue')
      },
      { path: 'delivery-order',
        title: '快递订单',
        name: 'delivery-order',
        component: () => import('@/views/goodsell/deliveryOrder.vue')
      }
  ]
};

export default goodsellMap;
