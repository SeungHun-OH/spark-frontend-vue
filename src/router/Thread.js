const routes = [
  {
    path: '/Thread/ThreadMain',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Thread/ThreadMain.vue')
  }
];

export default routes;
