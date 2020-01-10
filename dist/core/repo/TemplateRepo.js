"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = tslib_1.__importDefault(require("../connection/Rdb"));
const ColumnModel_1 = tslib_1.__importDefault(require("../model/ColumnModel"));
const TemplateModel_1 = tslib_1.__importDefault(require("../model/TemplateModel"));
const Page_1 = tslib_1.__importDefault(require("../entity/Page"));
const sequelize_typescript_1 = require("sequelize-typescript");
const TemplateRepoImpl = {
    save(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let result = yield TemplateModel_1.default.create(data, { transaction: t });
                Object.assign(data, { id: result.id });
                let array = data.columns;
                if (array === undefined) {
                    throw Error("empty column in template.");
                }
                for (let c of array) {
                    c.tempId = result.id;
                    yield ColumnModel_1.default.create(c, { transaction: t });
                }
            })).then(() => {
                console.debug("save template success.");
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });
    },
    destroy(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let columnNum = yield ColumnModel_1.default.destroy({
                    where: { tempId: id },
                    transaction: t
                });
                let num = yield TemplateModel_1.default.destroy({
                    where: { id: id },
                    transaction: t
                });
            })).then(() => {
                console.debug("delete template success.");
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });
    },
    update(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Rdb_1.default.transaction((t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let id = data.id;
                if (id === undefined) {
                    throw Error("template id cannot null.");
                }
                let columnNum = yield ColumnModel_1.default.destroy({
                    where: { tempId: id },
                    transaction: t
                });
                let result = yield TemplateModel_1.default.update(data, {
                    where: { id: id },
                    transaction: t
                });
                let array = data.columns;
                if (array === undefined) {
                    throw Error("empty column in template.");
                }
                for (let c of array) {
                    c.tempId = id;
                    yield ColumnModel_1.default.create(c, { transaction: t });
                }
            })).then(() => {
                console.debug("update template success.");
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });
    },
    query(pageNum, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield TemplateModel_1.default.findAndCountAll({
                order: [
                    ['ID', 'DESC']
                ],
                limit: size,
                offset: (pageNum - 1) * size,
                subQuery: false
            });
            let page = new Page_1.default({ rows: trans(result.rows), count: result.count });
            page.setCurrent(pageNum);
            page.setSize(size);
            return page;
        });
    },
    all() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield TemplateModel_1.default.findAll({
                order: [
                    ['ID', 'DESC']
                ]
            });
            return trans(result);
        });
    },
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                let c = { type: col.type, name: col.name, tempId: col.tempId };
                columns.push(c);
            }
            return { columns: columns, name: data.name, delimiter: data.delimiter, id: data.id, date: data.date };
        });
    }
};
function trans(source) {
    let array = [];
    for (let t of source) {
        let columns = [];
        let temp = { columns: columns, name: t.name, delimiter: t.delimiter, id: t.id, date: t.date };
        array.push(temp);
    }
    return array;
}
exports.default = TemplateRepoImpl;
