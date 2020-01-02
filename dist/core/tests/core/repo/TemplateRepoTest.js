"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Column_1 = tslib_1.__importDefault(require("../../../src/core/entity/Column"));
const Template_1 = tslib_1.__importDefault(require("../../../src/core/entity/Template"));
const TemplateRepo_1 = tslib_1.__importDefault(require("../../../src/core/repo/TemplateRepo"));
describe('Repo', () => {
    let id;
    describe('#check template repo.', () => {
        it('save', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let col1 = new Column_1.default(1, 'col1');
            let col2 = new Column_1.default(2, 'col2');
            let col3 = new Column_1.default(3);
            let template = new Template_1.default([col1, col2, col3], 'unit_test', ',');
            console.log("perpare save:", JSON.stringify(template));
            yield TemplateRepo_1.default.save(template);
            console.log(JSON.stringify(template));
            id = template.getId();
        }));
        it('query', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let result = yield TemplateRepo_1.default.query(1, 10);
            console.log(JSON.stringify(result));
        }));
        it('update', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let col1 = new Column_1.default(1, 'col11');
            let col2 = new Column_1.default(2, 'col21');
            let col3 = new Column_1.default(3, 'col31');
            let template = new Template_1.default([col1, col2, col3], 'unit_test2', '.', id);
            yield TemplateRepo_1.default.update(template);
        }));
        it('find', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (id === undefined) {
                return;
            }
            let result = yield TemplateRepo_1.default.find(id);
            console.log(JSON.stringify(result));
        }));
        it('destroy', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (id === undefined) {
                return;
            }
            yield TemplateRepo_1.default.destroy(id);
        }));
    });
});
