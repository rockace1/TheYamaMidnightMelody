"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = require("../connection/Rdb");
const Template_1 = tslib_1.__importDefault(require("../entity/Template"));
const Result_1 = tslib_1.__importDefault(require("../entity/Result"));
const TemplateRepo_1 = tslib_1.__importDefault(require("../repo/TemplateRepo"));
const Convertor_1 = tslib_1.__importDefault(require("./Convertor"));
const electron_1 = require("electron");
const initDatabase = () => {
    Rdb_1.init();
};
electron_1.ipcMain.on('convertDoc', (event, data) => {
    try {
        Convertor_1.default.convert(data.data, () => {
            let result = Result_1.default.getSuccess();
            event.reply('convertDone', { index: data.index, result: result });
        });
    }
    catch (err) {
        let result = Result_1.default.getFail(err.stack);
        event.reply('convertDone', { index: data.index, result: result });
    }
});
electron_1.ipcMain.on('queryTemplate', (event, param) => {
    let pageNum = 1;
    if (param.pageNum > 1) {
        pageNum = param.pageNum;
    }
    let size = 10;
    if (param.size > 10) {
        size = param.size;
    }
    TemplateRepo_1.default.query(pageNum, size).then((data) => {
        event.returnValue = Result_1.default.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
electron_1.ipcMain.on('allTemplate', (event) => {
    TemplateRepo_1.default.all().then((data) => {
        event.returnValue = Result_1.default.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
electron_1.ipcMain.on('createTemplate', (event, data) => {
    data = Template_1.default.from(data);
    TemplateRepo_1.default.save(data).then(() => {
        event.returnValue = Result_1.default.getSuccess();
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
electron_1.ipcMain.on('destroyTemplate', (event, id) => {
    TemplateRepo_1.default.destroy(id).then(() => {
        event.returnValue = Result_1.default.getSuccess();
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
electron_1.ipcMain.on('updateTemplate', (event, data) => {
    data = Template_1.default.from(data);
    let id = data.getId();
    if (id === undefined) {
        throw Error("template id cannot null.");
    }
    TemplateRepo_1.default.find(id).then((exist) => {
        if (exist === null) {
            throw Error("template " + id + " not exist.");
        }
        TemplateRepo_1.default.update(data).then(() => {
            event.returnValue = Result_1.default.getSuccess();
        }).catch((err) => {
            event.returnValue = Result_1.default.getFail(err.stack);
        });
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
electron_1.ipcMain.on('findTemplate', (event, id) => {
    TemplateRepo_1.default.find(id).then((data) => {
        event.returnValue = Result_1.default.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result_1.default.getFail(err.stack);
    });
});
exports.default = { initDatabase };
//# sourceMappingURL=Service.js.map