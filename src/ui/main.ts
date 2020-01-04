import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';
import templateController from './controller/TemplateController';
import convertController from './controller/ConvertorController';

Vue.config.productionTip = false;
Vue.use(ElementUI);

let Application: Vue = new Vue({
    router,
    render: h => h(App)
});
Vue.prototype.$remote = {
    query: templateController.query,
    all: templateController.all,
    create: templateController.create,
    find: templateController.find,
    update: templateController.update,
    destroy: templateController.destroy,
    convert: convertController.convert,
    isMac: convertController.isMac,
    isLinux: convertController.isLinux,
    isWin: convertController.isWin,
    getSep: convertController.getSep,
};
Vue.prototype.$success = (msg: string, v: Vue): void => {
    v.$notify.success({
        title: "成功",
        message: msg
    });
};
Vue.prototype.$error = (msg: string, v: Vue): void => {
    v.$notify.error({
        title: "错误",
        message: msg
    });
};
Vue.prototype.$warning = (msg: string, v: Vue): void => {
    v.$notify.warning({
        title: "警告",
        message: msg
    });
};

Application.$mount('#app');
