import { createRouter, createWebHistory } from 'vue-router';
import MainFeed from '../views/MainFeed.vue';
import Matching from '../views/Matching.vue';
import MyFeed from '../views/MyFeed.vue';
import Hearts from '../views/Hearts.vue';
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Member from './Member'

const routes = [
  { path: '/', component: MainFeed },
  { path: '/matching', component: Matching },
  { path: '/feed', component: MyFeed },
  { path: '/hearts', component: Hearts },
];
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  ...Member
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router