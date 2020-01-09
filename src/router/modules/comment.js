import Main from '@/views/Main.vue';

const commentMap = {
  path: '/comment',
  name: 'comment',
  icon: 'comment',
  title: '评论',
  component: Main,
  children: [
      { path: 'index', title: '评论', name: 'comment_index', component: () => import('@/views/comment/index.vue') }
  ]
};

export default commentMap;
