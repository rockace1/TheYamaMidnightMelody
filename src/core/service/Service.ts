import Connector from '../connection/Rdb';
import { Template, Doc, Option } from '../entity/Model';
import Page from '../common/Page';
import templateRepo from '../repo/TemplateRepo';
import optionRepo from '../repo/OptionRepo';
import Convertor from './Convertor';
import MelodyException from '../common/Exception';

export interface ConvertorCallback {
    (index: number, err: Error | undefined): void
}

export interface Service {
    initDatabase(): void;
    findTemplate(id: number): Promise<Template | null>;
    queryTemplate(param: { pageNum: number, size: number }): Promise<Page<Template>>;
    allTemplate(): Promise<Template[]>;
    createTemplate(data: Template): Promise<void>;
    destroyTemplate(id: number): Promise<void>;
    updateTemplate(data: Template): Promise<void>;
    convertDoc(data: { index: number, data: Doc }, callback: ConvertorCallback): void;
    saveOption(array: Option[]): Promise<void>;
    getOption(): Promise<Option[]>;
}

const ServiceImpl: Service = {
    initDatabase(): void {
        Connector.init();
    },

    async findTemplate(id: number): Promise<Template | null> {
        return await templateRepo.find(id);
    },

    async queryTemplate(param: { pageNum: number, size: number }): Promise<Page<Template>> {
        let pageNum = 1;
        if (param.pageNum > 1) {
            pageNum = param.pageNum;
        }
        let size = 10;
        if (param.size > 10) {
            size = param.size;
        }
        return await templateRepo.query(pageNum, size);
    },

    async allTemplate(): Promise<Template[]> {
        return await templateRepo.all();
    },

    async createTemplate(data: Template): Promise<void> {
        await templateRepo.save(data);
    },

    async destroyTemplate(id: number): Promise<void> {
        await templateRepo.destroy(id);
    },

    async updateTemplate(data: Template): Promise<void> {
        let id = data.id;
        if (id === undefined) {
            throw new MelodyException(`template id cannot null.`);
        }
        let exist: Template | null = await templateRepo.find(id);
        if (exist === null) {
            throw new MelodyException(`template ${id} not exist.`);
        }
        await templateRepo.update(data);
    },

    convertDoc(data: { index: number, data: Doc }, callback: ConvertorCallback): void {
        try {
            Convertor.convert(data.data, () => {
                callback(data.index, undefined);
            });
        } catch (err) {
            callback(data.index, err);
        }
    },

    async saveOption(array: Option[]): Promise<void> {
        optionRepo.save(array);
    },
    
    async getOption(): Promise<Option[]> {
        return optionRepo.all();
    }
}

export default ServiceImpl;