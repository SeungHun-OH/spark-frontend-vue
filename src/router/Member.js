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
  },
  {
    path: '/Admin',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Admin.vue'
    )
  }
];

export default routes;
