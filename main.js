"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const Service_1 = tslib_1.__importDefault(require("./src/core/service/Service"));
const appName = require('./package.json').name;
let mainWindow;
const createWindow = () => {
    let width = 1024;
    let height = 768;
    let preload = `${__dirname}\\Preload.js`;
    mainWindow = new electron_1.BrowserWindow({
        minWidth: width, minHeight: height,
        width: width, height: height,
        autoHideMenuBar: false,
        webPreferences: {
            nodeIntegration: true,
            preload: preload
        }
    });
    mainWindow.setMenuBarVisibility(true);
    mainWindow.setTitle(appName);
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:8000');
        mainWindow.webContents.openDevTools;
    }
    else {
        let path = `${__dirname}\\dist\\index.html`;
        mainWindow.loadFile(path);
    }
    mainWindow.on('close', () => {
        mainWindow = null;
    });
    Service_1.default.initDatabase();
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map