"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const path_1 = tslib_1.__importDefault(require("path"));
const Service_1 = tslib_1.__importDefault(require("./service/Service"));
let mainWindow;
const createWindow = () => {
    let width = 1024;
    let isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        width = 1595;
    }
    let height = 768;
    let preload = path_1.default.join(`${__dirname}`, 'preload.js');
    mainWindow = new electron_1.BrowserWindow({
        minWidth: width, minHeight: height,
        width: width, height: height,
        webPreferences: {
            nodeIntegration: true,
            preload: preload
        }
    });
    mainWindow.setTitle('Melody');
    if (isDev) {
        mainWindow.autoHideMenuBar = false;
        mainWindow.setMenuBarVisibility(true);
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:8000');
    }
    else {
        mainWindow.autoHideMenuBar = true;
        mainWindow.setMenuBarVisibility(false);
        mainWindow.loadFile(path_1.default.join(`${__dirname}`, '..', 'render', 'index.html'));
    }
    mainWindow.on('close', () => {
        mainWindow = null;
    });
};
electron_1.app.on('ready', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    createWindow();
    Service_1.default.initDatabase();
    if (process.env.NODE_ENV !== 'development') {
        electron_1.globalShortcut.register('CmdOrCtrl+R', () => { });
        electron_1.globalShortcut.register('CmdOrCtrl+Shift+I', () => { });
        electron_1.globalShortcut.register('CmdOrCtrl+Shift+R', () => { });
    }
}));
electron_1.app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        electron_1.app.exit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
process.on('uncaughtException', (err) => {
    electron_1.dialog.showMessageBox({
        type: 'warning',
        title: '软件异常，即将退出',
        message: '未知异常：' + err.stack,
    }).then(() => {
        mainWindow = null;
        electron_1.app.exit();
    });
});
