"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const ColumnModel_1 = tslib_1.__importDefault(require("./ColumnModel"));
let TemplateModel = class TemplateModel extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment('ID'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
], TemplateModel.prototype, "id", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment('模板名称'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], TemplateModel.prototype, "name", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Comment('分隔符'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], TemplateModel.prototype, "delimiter", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Comment('创建时间'),
    sequelize_typescript_1.CreatedAt,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.DATE)
], TemplateModel.prototype, "date", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.HasMany(() => ColumnModel_1.default)
], TemplateModel.prototype, "columns", void 0);
TemplateModel = tslib_1.__decorate([
    sequelize_typescript_1.Table({ tableName: 'excel_template' })
], TemplateModel);
exports.default = TemplateModel;
//# sourceMappingURL=TemplateModel.js.map