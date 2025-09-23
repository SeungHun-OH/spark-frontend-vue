const routes = [
  {
    path: '/Member/CategorySurvey/Preference',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/CategorySurvey/Preference.vue'
    )
  },
  {
    path: '/Member/CategorySurvey/Hobbies',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/CategorySurvey/Hobbies.vue')
  },
  {
    path: '/Member/CategorySurvey/IdealType',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/CategorySurvey/IdealType.vue'
    )
  },
  {
    path: '/Member/CategorySurvey/Mbti',
    component: () => import(
      /* webpackChunkName: "about" */
      '@/views/Member/CategorySurvey/Mbti.vue'
    )
  }
];

export default routes;
