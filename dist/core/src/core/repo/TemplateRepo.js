"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = tslib_1.__importDefault(require("../connection/Rdb"));
const ColumnModel_1 = tslib_1.__importDefault(require("../model/ColumnModel"));
const TemplateModel_1 = tslib_1.__importDefault(require("../model/TemplateModel"));
const Template_1 = tslib_1.__importDefault(require("../entity/Template"));
const Column_1 = tslib_1.__importDefault(require("../entity/Column"));
const Page_1 = tslib_1.__importDefault(require("../entity/Page"));
const sequelize_typescript_1 = require("sequelize-typescript");
const save = (data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let result = yield TemplateModel_1.default.create(data, { transaction: t });
        data.setId(result.id);
        let array = data.getColumns();
        if (array === undefined) {
            throw Error("empty column in template.");
        }
        for (let c of array) {
            c.setTempId(result.id);
            yield ColumnModel_1.default.create(c, { transaction: t });
        }
    })).then(() => {
        console.debug("save template success.");
    }).catch((err) => {
        console.debug(err);
        throw err;
    });
});
const destroy = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let columnNum = yield ColumnModel_1.default.destroy({
            where: { tempId: id },
            transaction: t
        });
        console.debug("delete column:", columnNum);
        let num = yield TemplateModel_1.default.destroy({
            where: { id: id },
            transaction: t
        });
        console.debug("delete template:", num);
    })).then(() => {
        console.debug("delete template success.");
    }).catch((err) => {
        console.debug(err);
        throw err;
    });
});
const update = (data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let id = data.getId();
        if (id === undefined) {
            throw Error("template id cannot null.");
        }
        let columnNum = yield ColumnModel_1.default.destroy({
            where: { tempId: id },
            transaction: t
        });
        console.debug("delete column:", columnNum);
        let result = yield TemplateModel_1.default.update(data, {
            where: { id: id },
            transaction: t
        });
        let array = data.getColumns();
        if (array === undefined) {
            throw Error("empty column in template.");
        }
        for (let c of array) {
            c.setTempId(id);
            yield ColumnModel_1.default.create(c, { transaction: t });
        }
    })).then(() => {
        console.debug("update template success.");
    }).catch((err) => {
        console.debug(err);
        throw err;
    });
});
const query = (pageNum, size) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let result = yield TemplateModel_1.default.findAndCountAll({
        order: [
            ['ID', 'DESC']
        ],
        limit: size,
        offset: (pageNum - 1) * size,
        subQuery: false
    });
    let array = [];
    for (let t of result.rows) {
        let columns = [];
        let temp = new Template_1.default(columns, t.name, t.delimiter, t.id, t.date);
        array.push(temp);
    }
    let page = new Page_1.default({ rows: array, count: result.count });
    page.setCurrent(pageNum);
    page.setSize(size);
    return page;
});
const all = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let result = yield TemplateModel_1.default.findAll({
        order: [
            ['ID', 'DESC']
        ]
    });
    let array = [];
    for (let t of result) {
        let columns = [];
        let temp = new Template_1.default(columns, t.name, t.delimiter, t.id, t.date);
        array.push(temp);
    }
    return array;
});
const find = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let data = yield TemplateModel_1.default.findByPk(id, {
        include: [{
                model: ColumnModel_1.default,
                where: { tempId: sequelize_typescript_1.Sequelize.col('TemplateModel.id') }
            }],
    });
    if (data === null) {
        return null;
    }
    let columns = [];
    for (let col of data.columns) {
        let c = new Column_1.default(col.type, col.name, col.tempId);
        columns.push(c);
    }
    return new Template_1.default(columns, data.name, data.delimiter, data.id, data.date);
});
exports.default = { save, query, find, destroy, update, all };
