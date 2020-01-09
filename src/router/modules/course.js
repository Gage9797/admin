import Main from '@/views/Main.vue';

const courseMap = {
  path: '/course',
  name: 'course',
  icon: 'settings',
  title: '培训管理',
  component: Main,
  children: [
      { path: 'index', title: '签到', name: 'course_index', component: () => import('@/views/course/index.vue') }
  ]
};

export default courseMap;
