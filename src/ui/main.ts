import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';
import templateController from './controller/TemplateController';

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$query = templateController.query;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
