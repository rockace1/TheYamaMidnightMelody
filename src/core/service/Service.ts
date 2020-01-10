import Connector from '../connection/Rdb';
import Template from '../entity/Template';
import Page from '../entity/Page';
import Result from '../entity/Result';
import { Doc } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import Convertor from './Convertor';

export interface ConvertorCallback {
    (result: Result<any>, index: number, err: Error | undefined): void
}

export interface Service {
    initDatabase(): void;
    findTemplate(id: number): Promise<Result<any>>;
    queryTemplate(param: { pageNum: number, size: number }): Promise<Result<any>>;
    allTemplate(): Promise<Result<any>>;
    createTemplate(data: Template): Promise<Result<void>>;
    destroyTemplate(id: number): Promise<Result<void>>;
    updateTemplate(data: Template): Promise<Result<void>>;
    convertDoc(data: { index: number, data: Doc }, callback: ConvertorCallback): void;
}

const ServiceImpl: Service = {
    initDatabase(): void {
        Connector.init();
    },

    async findTemplate(id: number): Promise<Result<any>> {
        try {
            let data: Template | null = await Repo.find(id);
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail(err.stack);
        }
    },

    async queryTemplate(param: { pageNum: number, size: number }): Promise<Result<any>> {
        let pageNum = 1;
        if (param.pageNum > 1) {
            pageNum = param.pageNum;
        }
        let size = 10;
        if (param.size > 10) {
            size = param.size;
        }
        try {
            let data: Page<Template> = await Repo.query(pageNum, size);
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail(err.stack);
        }
    },

    async allTemplate(): Promise<Result<any>> {
        try {
            let data: Array<Template> = await Repo.all();
            return Result.getSuccessWith(data);
        } catch (err) {
            return Result.getFail(err.stack);
        }
    },

    async createTemplate(data: Template): Promise<Result<void>> {
        try {
            await Repo.save(data);
            return Result.getSuccess();
        } catch (err) {
            console.error(err);
            return Result.getFail(err.stack);
        }
    },

    async destroyTemplate(id: number): Promise<Result<void>> {
        try {
            await Repo.destroy(id);
            return Result.getSuccess();
        } catch (err) {
            return Result.getFail(err.stack);
        }
    },

    async updateTemplate(data: Template): Promise<Result<void>> {
        let id = data.id;
        if (id === undefined) {
            return Result.getFail("template id cannot null.");
        }
        try {
            let exist: Template | null = await Repo.find(id);
            if (exist === null) {
                return Result.getFail("template " + id + " not exist.");
            }
            await Repo.update(data);
            return Result.getSuccess();
        } catch (err) {
            return Result.getFail(err.stack);
        }
    },

    convertDoc(data: { index: number, data: Doc }, callback: ConvertorCallback): void {
        try {
            Convertor.convert(data.data, () => {
                let result: Result<void> = Result.getSuccess();
                callback(result, data.index, undefined);
            });
        } catch (err) {
            let result: Result<void> = Result.getFail(err.stack);
            callback(result, data.index, err);
        }
    }
}

export default ServiceImpl;