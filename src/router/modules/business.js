import Main from '@/views/Main.vue';

const businessMap = {
    path: '/business',
    name: 'business',
    icon: 'business',
    title: '营业',
    component: Main,
    children: [
        {
			path: 'seat-room',
			// alias: '/home',
            title: '营业管理',
            name: 'seat-room',
            component: () =>
                import('@/views/seat-room/index')
        }
        // , {
        //     path: 'sell',
        //     title: '商品售出',
        //     name: 'sell',
        //     component: () =>
        //         import('@/views/goods-sell/index')
        // }
    ]
};
// businessMap.watch('children',(a,b,c) => {
//     console.log('change',a,b,c)
// })
export default businessMap;
