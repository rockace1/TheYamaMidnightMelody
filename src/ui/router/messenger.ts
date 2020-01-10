import Vue from 'vue';

const messenger = new Vue();

interface Messenger {
    $on(event: string | string[], callback: Function): void;
    $emit(event: string, ...args: any[]): void;
    $error(msg: string, v: Vue): void;
    $success(msg: string, v: Vue): void;
    $warning(msg: string, v: Vue): void;
}

const MessengerImpl: Messenger = {
    $on(event: string | string[], callback: Function): void {
        messenger.$on(event, callback);
    },

    $emit(event: string, ...args: any[]): void {
        messenger.$emit(event, ...args);
    },

    $error(msg: string, v: Vue): void {
        v.$notify.error({
            title: "错误",
            message: msg
        });
    },

    $success(msg: string, v: Vue): void {
        v.$notify.success({
            title: "成功",
            message: msg
        });
    },

    $warning(msg: string, v: Vue): void {
        v.$notify.warning({
            title: "警告",
            message: msg
        });
    }
}


export default MessengerImpl;