"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = require("../connection/Rdb");
const TemplateRepo_1 = tslib_1.__importDefault(require("../repo/TemplateRepo"));
const electron_1 = require("electron");
const initDatabase = () => {
    Rdb_1.init();
};
electron_1.ipcMain.on('queryTemplate', (event, args) => {
    let pageNum = 1;
    if (args.pageNum > 1) {
        pageNum = args.pageNum;
    }
    let size = 10;
    if (args.size > 10 && args.size < 100) {
        size = args.size;
    }
    TemplateRepo_1.default.query(pageNum, size).then((data) => {
        event.returnValue = data;
        console.log('return data:', data);
    }).catch((err) => {
        console.error(err);
    });
});
exports.default = { initDatabase };
//# sourceMappingURL=Service.js.map