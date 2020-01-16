import path from 'path';
import { app, BrowserWindow, globalShortcut, dialog } from 'electron';
import service from './service/Service';
import MelodyException from './common/Exception';

const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow | null;

const createWindow = () => {
    let width: number = 1024;
    if (isDev) {
        width = 1595;
    }
    let height: number = 768;
    let preload: string = path.join(`${__dirname}`, 'preload.js');
    mainWindow = new BrowserWindow({
        minWidth: width, minHeight: height,
        width: width, height: height,
        webPreferences: {
            nodeIntegration: true,
            preload: preload
        }
    });
    mainWindow.setTitle('The Yama Midnight Melody');
    if (isDev) {
        mainWindow.autoHideMenuBar = false;
        mainWindow.setMenuBarVisibility(true);
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:8000');
    } else {
        mainWindow.autoHideMenuBar = true;
        mainWindow.setMenuBarVisibility(false);
        mainWindow.loadFile(path.join(`${__dirname}`, '..', 'render', 'index.html'));
    }

    mainWindow.on('close', () => {
        mainWindow = null;
    });
}

app.on('ready', async () => {
    createWindow();
    service.initDatabase();
    if (!isDev) {
        globalShortcut.register('CmdOrCtrl+R', () => { });
        globalShortcut.register('CmdOrCtrl+Shift+I', () => { });
        globalShortcut.register('CmdOrCtrl+Shift+R', () => { });
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.exit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});

function exceptionHandler(err: any) {
    if (err instanceof MelodyException) {
        dialog.showMessageBox({
            type: 'warning',
            title: err.message,
            message: '错误原因：' + err.stack,
        });
    } else {
        dialog.showMessageBox({
            type: 'warning',
            title: '软件异常，即将退出',
            message: '未知错误：' + err.stack,
        }).then(() => {
            mainWindow = null;
            app.exit();
        });
    }
}

process.on('unhandledRejection', (err) => {
    exceptionHandler(err);
});
process.on('uncaughtException', (err) => {
    exceptionHandler(err);
});