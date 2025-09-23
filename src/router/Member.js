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
  {
    path: '/Member/Example',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/Example.vue'
    )
  },
  {
    path: '/Member/Profile',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/Profile'
    )
  }
];

export default routes;
