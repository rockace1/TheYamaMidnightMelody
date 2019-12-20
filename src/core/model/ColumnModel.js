"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const TemplateModel_1 = tslib_1.__importDefault(require("./TemplateModel"));
let ColumnModel = class ColumnModel extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment('模板ID'),
    sequelize_typescript_1.ForeignKey(() => TemplateModel_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
], ColumnModel.prototype, "tempId", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Comment('列名称'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], ColumnModel.prototype, "name", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment('列类型'),
    sequelize_typescript_1.IsInt,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], ColumnModel.prototype, "type", void 0);
ColumnModel = tslib_1.__decorate([
    sequelize_typescript_1.Table({
        tableName: 'excel_column',
        indexes: [{ unique: false, name: 'column_index', using: 'BTREE', fields: ['tempId'] }]
    })
], ColumnModel);
exports.default = ColumnModel;
//# sourceMappingURL=ColumnModel.js.map