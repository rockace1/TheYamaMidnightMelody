import { app, BrowserWindow, globalShortcut } from 'electron';
import database from './src/core/service/Service';

let mainWindow: BrowserWindow | null;

const createWindow = () => {
    let width: number = 1024;
    let height: number = 768;
    let preload: string = `${__dirname}\\preload.js`;
    mainWindow = new BrowserWindow({
        minWidth: width, minHeight: height,
        width: width, height: height,
        webPreferences: {
            nodeIntegration: true,
            preload: preload
        }
    });
    mainWindow.setTitle('Melody');
    if (process.env.NODE_ENV === 'development') {
        mainWindow.setAutoHideMenuBar(false);
        mainWindow.setMenuBarVisibility(true);
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:8000');
    } else {
        mainWindow.setAutoHideMenuBar(true);
        mainWindow.setMenuBarVisibility(false);
        mainWindow.loadFile(`${__dirname}\\..\\render\\index.html`);
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