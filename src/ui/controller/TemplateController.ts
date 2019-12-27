import Template from '../../core/entity/Template';
import Page from '../../core/entity/Page';
import Result from '../../core/entity/Result';

const query = (page: number, size?: number): Result<Page<Template>> => {
    if (size === undefined || size === null) {
        size = 10;
    }
    let result: Result<Page<Template>> = window.ipcRenderer.sendSync('queryTemplate', { pageNum: page, size: size });
    if (result.success) {
        result.data = Page.from(result.data, Template.from);
    }
    return result;
}

const all = (): Result<Array<Template>> => {
    let result: Result<Array<Template>> = window.ipcRenderer.sendSync('allTemplate');
    if (result.success) {
        let array: Array<Template> = [];
        for (let t of result.data) {
            array.push(Template.from(t));
        }
        result.data = array;
    }
    return result;
}

const create = (data: Template): Result<void> => {
    let result: Result<void> = window.ipcRenderer.sendSync('createTemplate', data);
    return result;
}

const destroy = (id: number): Result<void> => {
    let result: Result<void> = window.ipcRenderer.sendSync('destroyTemplate', id);
    return result;
}

const update = (data: Template): Result<void> => {
    let result: Result<void> = window.ipcRenderer.sendSync('updateTemplate', data);
    return result;
}

const find = (id: number): Result<Template> => {
    let result: Result<Template> = window.ipcRenderer.sendSync('findTemplate', id);
    if (result.success && result.data !== null) {
        result.data = Template.from(result.data);
    }
    return result;
}

export default { query, create, destroy, update, find, all }