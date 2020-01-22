import Connector from '../connection/Rdb';
import { Template, Doc, Option } from '../entity/Model';
import { OptionKey } from "../../core/common/Constant";
import Page from '../common/Page';
import templateRepo from '../repo/TemplateRepo';
import optionRepo from '../repo/OptionRepo';
import Convertor from './Convertor';
import Kit from '../common/Kit';
import MelodyException from '../common/Exception';

export interface ConvertorCallback {
    (index: number, err: Error | undefined): void
}

export interface Service {
    initDatabase(): Promise<void>;
    findTemplate(id: number): Promise<Template | null>;
    queryTemplate(param: { pageNum: number, size: number }): Promise<Page<Template>>;
    allTemplate(): Promise<Template[]>;
    createTemplate(data: Template): Promise<void>;
    copyTemplate(id: number): Promise<void>;
    destroyTemplate(id: number): Promise<void>;
    updateTemplate(data: Template): Promise<void>;
    convertDoc(data: { index: number, data: Doc }, callback: ConvertorCallback): void;
    saveOption(array: Option[]): Promise<void>;
    allOption(): Promise<Option[]>;
    findOption(key: number): Option | undefined;
}

const ServiceImpl: Service = {
    async initDatabase(): Promise<void> {
        await Connector.init();
        await optionRepo.all();
        let option: Option | undefined = optionRepo.find(OptionKey.CLEAN);
        if (option && option.value === "1") {
            await Connector.init(true);
        }
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
        for (let c of data.columns) {
            if (Kit.isNotNull(c.prop)) {
                c.prop_str = JSON.stringify(c.prop);
            }
        }
        await templateRepo.save(data);
    },

    async copyTemplate(id: number): Promise<void> {
        let source: Template | null = await this.findTemplate(id);
        if (Kit.isNull(source)) {
            throw new MelodyException(`template[${id}] not exist.`);
        }
        let name = prepareName(source!.name!);
        let data: Template = { columns: source!.columns, name: name, delimiter: source!.delimiter };
        await this.createTemplate(data);
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
        for (let c of data.columns) {
            if (Kit.isNotNull(c.prop)) {
                c.prop_str = JSON.stringify(c.prop);
            }
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

    async saveOption(data: any): Promise<void> {
        let array: Option[] = [];
        if (data[OptionKey.BASE_FOLDER]) {
            array.push({ key: OptionKey.BASE_FOLDER, value: data[OptionKey.BASE_FOLDER] });
        }
        if (data[OptionKey.EXT]) {
            array.push({ key: OptionKey.EXT, value: data[OptionKey.EXT] });
        }
        if (data[OptionKey.CLEAN]) {
            array.push({ key: OptionKey.CLEAN, value: data[OptionKey.CLEAN] });
        }
        optionRepo.save(array);
        this.allOption();
    },

    async allOption(): Promise<Option[]> {
        return optionRepo.all();
    },

    findOption(key: number): Option | undefined {
        return optionRepo.find(key);
    },
}

function prepareName(sourceName: string): string {
    if (sourceName.length > 250) {
        sourceName = sourceName.substring(0, 250);
    }
    return sourceName + "_copy";
}

export default ServiceImpl;