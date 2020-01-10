"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
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
    }
};
exports.default = platform;
