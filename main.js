"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const appName = require('./package.json').name;
let mainWindow;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({ width: 1024, height: 768, autoHideMenuBar: true });
    mainWindow.setMenuBarVisibility(false);
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