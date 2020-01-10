import rdb from '../connection/Rdb';

import ColumnModel from '../model/ColumnModel';
import TemplateModel from '../model/TemplateModel';
import Template from '../entity/Template';
import Column from '../entity/Column';
import Page from '../entity/Page';
import { Sequelize } from 'sequelize-typescript';

export interface TemplateRepo {
    save(data: Template): Promise<void>;
    destroy(id: number): Promise<void>;
    update(data: Template): Promise<void>;
    query(pageNum: number, size: number): Promise<Page<Template>>;
    all(): Promise<Array<Template>>;
    find(id: number): Promise<Template | null>;
}

const TemplateRepoImpl: TemplateRepo = {
    async save(data: Template): Promise<void> {
        await rdb.transaction(async (t) => {
            let result: TemplateModel = await TemplateModel.create<TemplateModel>(data, { transaction: t });
            Object.assign(data, { id: result.id });
            let array: Column[] | undefined = data.columns;
            if (array === undefined) {
                throw Error("empty column in template.");
            }
            for (let c of array) {
                c.tempId = result.id;
                await ColumnModel.create<ColumnModel>(c, { transaction: t });
            }
        }).then(() => {
            console.debug("save template success.");
        }).catch((err: any) => {
            console.error(err);
            throw err;
        });
    },

    async destroy(id: number): Promise<void> {
        await rdb.transaction(async (t) => {
            let columnNum: number = await ColumnModel.destroy({
                where: { tempId: id },
                transaction: t
            });
            let num: number = await TemplateModel.destroy({
                where: { id: id },
                transaction: t
            });
        }).then(() => {
            console.debug("delete template success.");
        }).catch((err: any) => {
            console.error(err);
            throw err;
        });
    },

    async update(data: Template): Promise<void> {
        await rdb.transaction(async (t) => {
            let id = data.id;
            if (id === undefined) {
                throw Error("template id cannot null.")
            }
            let columnNum = await ColumnModel.destroy({
                where: { tempId: id },
                transaction: t
            });
            let result = await TemplateModel.update(data, {
                where: { id: id },
                transaction: t
            });
            let array: Column[] | undefined = data.columns;
            if (array === undefined) {
                throw Error("empty column in template.");
            }
            for (let c of array) {
                c.tempId = id;
                await ColumnModel.create<ColumnModel>(c, { transaction: t });
            }
        }).then(() => {
            console.debug("update template success.");
        }).catch((err: any) => {
            console.error(err);
            throw err;
        });
    },

    async query(pageNum: number, size: number): Promise<Page<Template>> {
        let result: { rows: TemplateModel[]; count: number } = await TemplateModel.findAndCountAll({
            order: [
                ['ID', 'DESC']
            ],
            limit: size,
            offset: (pageNum - 1) * size,
            subQuery: false
        });
        let page = new Page({ rows: trans(result.rows), count: result.count });
        page.setCurrent(pageNum);
        page.setSize(size);
        return page;
    },

    async all(): Promise<Template[]> {
        let result: TemplateModel[] = await TemplateModel.findAll({
            order: [
                ['ID', 'DESC']
            ]
        });
        return trans(result);
    },

    async find(id: number): Promise<Template | null> {
        let data: TemplateModel | null = await TemplateModel.findByPk(id, {
            include: [{
                model: ColumnModel,
                where: { tempId: Sequelize.col('TemplateModel.id') }
            }],
        });
        if (data === null) {
            return null;
        }
        let columns: Column[] = [];
        for (let col of data.columns) {
            let c = { type: col.type, name: col.name, tempId: col.tempId };
            columns.push(c);
        }
        return { columns: columns, name: data.name, delimiter: data.delimiter, id: data.id, date: data.date };
    }
}

function trans(source: TemplateModel[]): Template[] {
    let array: Template[] = [];
    for (let t of source) {
        let columns: Column[] = [];
        let temp = { columns: columns, name: t.name, delimiter: t.delimiter, id: t.id, date: t.date };
        array.push(temp);
    }
    return array;
}

export default TemplateRepoImpl;