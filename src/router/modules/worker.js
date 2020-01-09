import Main from '@/views/Main.vue';

const workerManageMap = {
    path: '/workerManage',
    name: 'workerManage',
    icon: 'staff',
    title: '员工管理',
    component: Main,
    children: [
        {
            path: 'index',
            title: '员工管理',
            name: 'workerIndex',
            component: () => import('@/views/worker/worker-index.vue')

        }]
};

export default workerManageMap;
