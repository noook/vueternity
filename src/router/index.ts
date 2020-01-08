import Vue, { VueConstructor } from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import History from '../views/History.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'History',
    component: Home as VueConstructor,
  },
  {
    path: '/history',
    name: 'history',
    component: History as VueConstructor,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
