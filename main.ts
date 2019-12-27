import { app, BrowserWindow, globalShortcut } from 'electron';
import database from './src/core/service/Service';
const appName = require('./package.json').name

let mainWindow: BrowserWindow | null;

const createWindow = () => {
    let width: number = 1024;
    let height: number = 768;
    let preload: string = `${__dirname}\\Preload.js`;
    mainWindow = new BrowserWindow({
        minWidth: width, minHeight: height,
        width: width, height: height,
        webPreferences: {
            nodeIntegration: true,
            preload: preload
        }
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.setAutoHideMenuBar(false);
        mainWindow.setMenuBarVisibility(true);
        mainWindow.setTitle(appName);
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:8000');
    } else {
        mainWindow.setAutoHideMenuBar(true);
        mainWindow.setMenuBarVisibility(false);
        mainWindow.setTitle(appName);
        mainWindow.loadFile(`${__dirname}\\dist\\index.html`);
    }

    mainWindow.on('close', () => {
        mainWindow = null;
    });
    database.initDatabase();
}

app.on('ready', async () => {
    createWindow();
    if (process.env.NODE_ENV !== 'development') {
        globalShortcut.register('CmdOrCtrl+R', () => { });
        globalShortcut.register('CmdOrCtrl+Shift+I', () => { });
        globalShortcut.register('CmdOrCtrl+Shift+R', () => { });
    }
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});