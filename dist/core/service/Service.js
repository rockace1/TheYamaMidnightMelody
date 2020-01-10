"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = tslib_1.__importDefault(require("../connection/Rdb"));
const Result_1 = tslib_1.__importDefault(require("../entity/Result"));
const TemplateRepo_1 = tslib_1.__importDefault(require("../repo/TemplateRepo"));
const Convertor_1 = tslib_1.__importDefault(require("./Convertor"));
const ServiceImpl = {
    initDatabase() {
        Rdb_1.default.init();
    },
    findTemplate(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield TemplateRepo_1.default.find(id);
                return Result_1.default.getSuccessWith(data);
            }
            catch (err) {
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    queryTemplate(param) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pageNum = 1;
            if (param.pageNum > 1) {
                pageNum = param.pageNum;
            }
            let size = 10;
            if (param.size > 10) {
                size = param.size;
            }
            try {
                let data = yield TemplateRepo_1.default.query(pageNum, size);
                return Result_1.default.getSuccessWith(data);
            }
            catch (err) {
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    allTemplate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield TemplateRepo_1.default.all();
                return Result_1.default.getSuccessWith(data);
            }
            catch (err) {
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    createTemplate(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield TemplateRepo_1.default.save(data);
                return Result_1.default.getSuccess();
            }
            catch (err) {
                console.error(err);
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    destroyTemplate(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield TemplateRepo_1.default.destroy(id);
                return Result_1.default.getSuccess();
            }
            catch (err) {
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    updateTemplate(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('update:', data);
            let id = data.id;
            if (id === undefined) {
                return Result_1.default.getFail("template id cannot null.");
            }
            try {
                let exist = yield TemplateRepo_1.default.find(id);
                if (exist === null) {
                    return Result_1.default.getFail("template " + id + " not exist.");
                }
                yield TemplateRepo_1.default.update(data);
                return Result_1.default.getSuccess();
            }
            catch (err) {
                return Result_1.default.getFail(err.stack);
            }
        });
    },
    convertDoc(data, callback) {
        try {
            Convertor_1.default.convert(data.data, () => {
                let result = Result_1.default.getSuccess();
                callback(result, data.index, undefined);
            });
        }
        catch (err) {
            let result = Result_1.default.getFail(err.stack);
            callback(result, data.index, err);
        }
    }
};
exports.default = ServiceImpl;
