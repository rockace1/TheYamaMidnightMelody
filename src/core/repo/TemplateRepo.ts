import rdb from '../connection/Rdb';

import ColumnModel from '../model/ColumnModel';
import TemplateModel from '../model/TemplateModel';
import Template from '../entity/Template';
import Column from '../entity/Column';
import Page from '../entity/Page';
import { Sequelize } from 'sequelize-typescript';

const save = async (data: Template): Promise<void> => {
    await rdb.transaction(async (t) => {
        let result: TemplateModel = await TemplateModel.create<TemplateModel>(data, { transaction: t });
        data.setId(result.id);
        let array: Array<Column> | undefined = data.getColumns();
        if (array === undefined) {
            throw Error("empty column in template.");
        }
        for (let c of array) {
            c.setTempId(result.id);
            await ColumnModel.create<ColumnModel>(c, { transaction: t });
        }
    }).then(() => {
        console.debug("save template success.");
    }).catch((err: any) => {
        console.debug(err);
        throw err;
    });
}

const destroy = async (id: number): Promise<void> => {
    await rdb.transaction(async (t) => {
        let columnNum: number = await ColumnModel.destroy({
            where: { tempId: id },
            transaction: t
        });
        console.debug("delete column:", columnNum);
        let num: number = await TemplateModel.destroy({
            where: { id: id },
            transaction: t
        });
        console.debug("delete template:", num);
    }).then(() => {
        console.debug("delete template success.");
    }).catch((err: any) => {
        console.debug(err);
        throw err;
    });
}

const update = async (data: Template): Promise<void> => {
    await rdb.transaction(async (t) => {
        let id = data.getId();
        if (id === undefined) {
            throw Error("template id cannot null.")
        }
        let exist = await TemplateModel.findByPk(id);
        if (exist === null) {
            throw Error("template " + id + " not exist.");
        }
        let columnNum = await ColumnModel.destroy({
            where: { tempId: id },
            transaction: t
        });
        console.debug("delete column:", columnNum);
        let result = await TemplateModel.update(data, {
            where: { id: id },
            transaction: t
        });
        let array: Array<Column> | undefined = data.getColumns();
        if (array === undefined) {
            throw Error("empty column in template.");
        }
        for (let c of array) {
            c.setTempId(id);
            await ColumnModel.create<ColumnModel>(c, { transaction: t });
        }
    }).then(() => {
        console.debug("update template success.");
    }).catch((err: any) => {
        console.debug(err);
        throw err;
    });
}

const query = async (pageNum: number, size: number): Promise<Page<Template>> => {
    let result: { rows: Array<TemplateModel>; count: number } = await TemplateModel.findAndCountAll({
        order: [
            ['ID', 'DESC']
        ],
        limit: size,
        offset: (pageNum - 1) * size,
        subQuery: false
    });
    let array: Array<Template> = [];
    for (let t of result.rows) {
        let columns: Array<Column> = [];
        let temp = new Template(columns, t.name, t.delimiter, t.id);
        array.push(temp);
    }
    let page = new Page({ rows: array, count: result.count });
    page.setCurrent(pageNum);
    page.setSize(size);
    return page;
}

const find = async (id: number): Promise<Template | null> => {
    let data: TemplateModel | null = await TemplateModel.findByPk(id, {
        include: [{
            model: ColumnModel,
            where: { tempId: Sequelize.col('TemplateModel.id') }
        }],
    });
    if (data === null) {
        return null;
    }
    let columns: Array<Column> = [];
    for (let col of data.columns) {
        let c = new Column(col.type, col.name, col.tempId);
        columns.push(c);
    }
    return new Template(columns, data.name, data.delimiter, data.id);
}

export default { save, query, find, destroy, update }