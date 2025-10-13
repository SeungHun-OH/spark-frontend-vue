const routes = [
  {
    path: '/Thread/ThreadMain',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Thread/ThreadMain.vue')
  },
  {
    path: '/Thread/ThreadAiQuetion',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Thread/ThreadAiQuetion.vue')
  }
];

export default routes;
