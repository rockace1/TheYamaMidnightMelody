import { Sequelize } from 'sequelize-typescript';
import rdb from '../connection/Rdb';
import ColumnTable from '../table/ColumnTable';
import TemplateTable from '../table/TemplateTable';
import { Template, Column, ColumnProp } from '../entity/Model';
import Page from '../common/Page';
import formater from '../func/Formater';
import MelodyException from '../common/Exception';
import Kit from '../common/Kit';

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
            let result: TemplateTable = await TemplateTable.create<TemplateTable>(data, { transaction: t });
            Object.assign(data, { id: result.id });
            let array: Column[] | undefined = data.columns;
            if (array === undefined) {
                throw new MelodyException(`empty column in template.`);
            }
            for (let c of array) {
                executeColumnData(c, result.id);
                await ColumnTable.create<ColumnTable>(c, { transaction: t });
            }
        }).catch((err: Error) => {
            throw new MelodyException(`save template error.`, err);
        });
    },

    async destroy(id: number): Promise<void> {
        await rdb.transaction(async (t) => {
            await ColumnTable.destroy({
                where: { tempId: id },
                transaction: t
            });
            await TemplateTable.destroy({
                where: { id: id },
                transaction: t
            });
        }).catch((err: Error) => {
            throw new MelodyException(`destroy template[${id}] error.`, err);
        });
    },

    async update(data: Template): Promise<void> {
        await rdb.transaction(async (t) => {
            let id = data.id!;
            await ColumnTable.destroy({
                where: { tempId: id },
                transaction: t
            });
            await TemplateTable.update(data, {
                where: { id: id },
                transaction: t
            });
            let array: Column[] | undefined = data.columns;
            if (array === undefined) {
                throw new MelodyException(`empty column in template.`);
            }
            let i = 1;
            for (let c of array) {
                executeColumnData(c, id);
                await ColumnTable.create<ColumnTable>(c, { transaction: t });
            }
        }).catch((err: Error) => {
            throw new MelodyException(`update template[${data.id}] error.`, err);
        });
    },

    async query(pageNum: number, size: number): Promise<Page<Template>> {
        try {
            let result: { rows: TemplateTable[]; count: number } = await TemplateTable.findAndCountAll({
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
        } catch (err) {
            throw new MelodyException(`query template error.`, err);
        }
    },

    async all(): Promise<Template[]> {
        try {
            let result: TemplateTable[] = await TemplateTable.findAll({
                order: [
                    ['ID', 'DESC']
                ]
            });
            return trans(result);
        } catch (err) {
            throw new MelodyException(`query all template error.`, err);
        }
    },

    async find(id: number): Promise<Template | null> {
        try {
            let data: TemplateTable | null = await TemplateTable.findByPk(id, {
                include: [{
                    model: ColumnTable,
                    where: { tempId: Sequelize.col('TemplateTable.id') }
                }],
            });
            if (data === null) {
                return null;
            }
            let columns: Column[] = [];
            for (let col of data.columns) {
                let c: Column = { type: col.type, name: col.name, tempId: col.tempId, fmt: col.fmt };
                if (Kit.isNotNull(col.prop_str)) {
                    let prop: ColumnProp = JSON.parse(col.prop_str!);
                    c.prop = prop;
                    c.prop_str = col.prop_str;
                }
                columns.push(c);
            }
            return { columns: columns, name: data.name, delimiter: data.delimiter, id: data.id, date: data.date };
        } catch (err) {
            throw new MelodyException(`find template[${id}] error.`, err);
        }
    }
}

function trans(source: TemplateTable[]): Template[] {
    let array: Template[] = [];
    for (let t of source) {
        let columns: Column[] = [];
        let temp = { columns: columns, name: t.name, delimiter: t.delimiter, id: t.id, date: t.date };
        array.push(temp);
    }
    return array;
}

function executeColumnData(column: Column, tempId: number): void {
    column.tempId = tempId;
    if (Kit.isNotNull(column.prop)) {
        column.prop_str = JSON.stringify(column.prop);
        column.prop = undefined;
    }
    column.fmt = formater.getFmt(column);
}

export default TemplateRepoImpl;