"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const ColumnType = [
    {
        name: "常规",
        value: 0
    }, {
        name: "数值",
        value: 1
    }, {
        name: "文本",
        value: 2
    }
];
exports.ColumnType = ColumnType;
const sep = path_1.default.sep;
const platformString = process.platform;
const isPlatform = (name) => {
    return platformString === name;
};
const Platform = {
    sep: () => {
        return sep;
    },
    name: () => {
        return platformString;
    },
    isWin: () => {
        return isPlatform('win32');
    },
    isMac: () => {
        return isPlatform('darwin');
    },
    isLinux: () => {
        return isPlatform('linux');
    },
};
exports.Platform = Platform;
