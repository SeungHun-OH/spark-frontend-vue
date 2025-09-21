const routes = [
  {
    path: '/Member/Login',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/Login')
  },
  {
    path: '/Member/Sign',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/Sign')
  },
];

export default routes;
