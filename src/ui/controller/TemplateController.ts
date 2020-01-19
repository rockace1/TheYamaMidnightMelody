import { Template } from '../../core/entity/Model';
import Page from '../../core/common/Page';
import { Service } from '../../core/service/Service';
const remote = window.require('electron').remote;
const service: Service = remote.require('../core/service/Service').default;

export interface TemplateController {
    query(page: number, size?: number): Promise<Page<Template>>;
    all(): Promise<Template[]>;
    create(data: Template): Promise<void>;
    copy(id: number): Promise<void>;
    destroy(id: number): Promise<void>;
    update(data: Template): Promise<void>;
    find(id: number): Promise<Template>;
}

const TemplateControllerImpl: TemplateController = {
    async query(page: number, size?: number): Promise<Page<Template>> {
        if (size === undefined || size === null) {
            size = 10;
        }
        try {
            let data: Page<Template> = await service.queryTemplate({ pageNum: page, size: size });
            return data;
        } catch (err) {
            return err;
        }
    },

    async all(): Promise<Template[]> {
        try {
            let data: Template[] = await service.allTemplate();
            return data;
        } catch (err) {
            return err;
        }
    },

    async create(data: Template): Promise<void> {
        try {
            await service.createTemplate(data);
        } catch (err) {
            return err;
        }
    },

    async copy(id: number): Promise<void> {
        try {
            await service.copyTemplate(id);
        } catch (err) {
            return err;
        }
    },

    async destroy(id: number): Promise<void> {
        try {
            await service.destroyTemplate(id);
        } catch (err) {
            return err;
        }
    },

    async update(data: Template): Promise<void> {
        try {
            await service.updateTemplate(data);
        } catch (err) {
            return err;
        }
    },

    async find(id: number): Promise<Template> {
        try {
            let data: Template | null = await service.findTemplate(id);
            return data;
        } catch (err) {
            return err;
        }
    }
}

export default TemplateControllerImpl;