import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/temp',
    name: 'temp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Temp.vue')
  }
]

const router = new VueRouter({
  routes
});

export default router;
