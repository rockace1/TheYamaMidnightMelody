import { Template } from '../../core/entity/Model';
import Page from '../../core/common/Page';
import Result from '../../core/common/Result';
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
        try {
            let data: Page<Template> = await service.queryTemplate({ pageNum: page, size: size });
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail('query template fail.');
        }
    },

    async all(): Promise<Result<Template[]>> {
        try {
            let data: Template[] = await service.allTemplate();
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail('query all template fail.');
        }
    },

    async create(data: Template): Promise<Result<void>> {
        try {
            await service.createTemplate(data);
            return Result.getSuccess();
        } catch (err) {
            return Result.getFail('create template fail.');
        }
    },

    async destroy(id: number): Promise<Result<void>> {
        try {
            await service.destroyTemplate(id);
            return Result.getSuccess();
        } catch (err) {
            return Result.getFail(`destroy template[${id}] fail.`);
        }
    },

    async update(data: Template): Promise<Result<void>> {
        try {
            await service.updateTemplate(data);
            return Result.getSuccess();
        } catch (err) {
            return Result.getFail('update template fail.');
        }
    },

    async find(id: number): Promise<Result<Template>> {
        try {
            let data: Template | null = await service.findTemplate(id);
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail(`find template[${id}] fail.`);
        }
    }
}

export default TemplateControllerImpl;