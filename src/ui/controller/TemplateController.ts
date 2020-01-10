import Template from '../../core/entity/Template';
import Page from '../../core/entity/Page';
import Result from '../../core/entity/Result';
import { Service } from '../../core/service/Service';
const remote = window.require('electron').remote;
const service: Service = remote.require('../core/service/Service').default;

export interface TemplateController {
    query(page: number, size?: number): Promise<Result<Page<Template>>>;
    all(): Promise<Result<Template[]>>;
    create(data: Template): Promise<Result<void>>;
    destroy(id: number): Promise<Result<void>>;
    update(data: Template): Promise<Result<void>>;
    find(id: number): Promise<Result<Template>>;
}

const TemplateControllerImpl: TemplateController = {
    async query(page: number, size?: number): Promise<Result<Page<Template>>> {
        if (size === undefined || size === null) {
            size = 10;
        }
        let result: Result<Page<Template>> = await service.queryTemplate({ pageNum: page, size: size });
        return result;
    },

    async all(): Promise<Result<Template[]>> {
        let result: Result<Template[]> = await service.allTemplate();
        return result;
    },

    async create(data: Template): Promise<Result<void>> {
        let result: Result<void> = await service.createTemplate(data);
        return result;
    },

    async destroy(id: number): Promise<Result<void>> {
        let result: Result<void> = await service.destroyTemplate(id);
        return result;
    },

    async update(data: Template): Promise<Result<void>> {
        let result: Result<void> = await service.updateTemplate(data);
        return result;
    },

    async find(id: number): Promise<Result<Template>> {
        let result: Result<Template> = await service.findTemplate(id);
        return result;
    }
}

export default TemplateControllerImpl;