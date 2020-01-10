"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const electron_1 = require("electron");
const sep = path_1.default.sep;
const platformName = process.platform;
function isPlatform(name) {
    return platformName === name;
}
const platform = {
    sep() {
        return sep;
    },
    name() {
        return platformName;
    },
    isWin() {
        return isPlatform('win32');
    },
    isMac() {
        return isPlatform('darwin');
    },
    isLinux() {
        return isPlatform('linux');
    },
    chooseFile() {
        let source = electron_1.dialog.showOpenDialogSync({
            filters: [{ name: 'TEXT', extensions: ['txt'] }],
            properties: ['openFile']
        });
        if (source && source.length > 0) {
            return source[0];
        }
    },
    getDestPath(source) {
        let dir = path_1.default.dirname(source);
        let base = path_1.default.basename(source, path_1.default.extname(source));
        let now = moment_1.default().format("YYYYMMDDHHmmss");
        let dest = dir + this.sep() + base + '-' + now + '.xlsx';
        return dest;
    }
};
exports.default = platform;
