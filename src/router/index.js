import { createRouter, createWebHistory } from 'vue-router';
import MainFeed from '../views/MainFeed.vue';
import Matching from '../views/Matching.vue';
import MyFeed from '../views/MyFeed.vue';
import Hearts from '../views/Hearts.vue';

const routes = [
  { path: '/', component: MainFeed },
  { path: '/matching', component: Matching },
  { path: '/feed', component: MyFeed },
  { path: '/hearts', component: Hearts },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router