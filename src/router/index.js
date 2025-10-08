import MainFeed from '../views/MainFeed.vue';
import Matching from '../views/Matching.vue';
import MyFeed from '../views/OtherFeed.vue';
import OtherFeed from '../views/OtherFeed.vue';
import Hearts from '../views/Hearts.vue';
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Member from './Member'
import Category from './Category'
import Profile from '@/views/Profile.vue';
import Preferences from '@/views/Preferences.vue';
import CreatePost from '@/views/CreatePost.vue';
import EditPost from '@/views/EditPost.vue';
const routes = [
  
  { path: '/', component: MainFeed },
  { path: '/matching', component: Matching },
  { path: '/feed', component: MyFeed },
  { path: '/otherfeed', component: OtherFeed },
  { path: '/hearts', component: Hearts },
  { path: '/Profile', component: Profile },
  
  { path: '/preferences', component: Preferences },
  { path: '/create-post', component: CreatePost },
  { path: '/edit-post/:fNo', component: EditPost, props: true },

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
  ...Member,
  ...Category
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router