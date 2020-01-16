import Vue from 'vue';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/temp',
        name: 'temp',
        component: () => import('../views/Temp.vue')
    },
    {
        path: '/option',
        name: 'option',
        component: () => import('../views/Option.vue')
    }
]

const router = new VueRouter({
    routes
});

export default router;
