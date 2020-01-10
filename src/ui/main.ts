import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';

Vue.config.productionTip = false;
Vue.use(ElementUI);

let Application: Vue = new Vue({
    router,
    render: h => h(App)
});

Application.$mount('#app');
