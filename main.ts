import { app, BrowserWindow } from 'electron';
import database from './src/core/service/Service';
const appName = require('./package.json').name

let mainWindow: BrowserWindow | null;

const createWindow = () => {
    let width: number = 1024;
    let height: number = 768;
    let preload:string = `${__dirname}\\Preload.js`;
    mainWindow = new BrowserWindow({
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
    } else {
        let path = `${__dirname}\\dist\\index.html`;
        mainWindow.loadFile(path);
    }

    mainWindow.on('close', () => {
        mainWindow = null;
    });
    database.initDatabase();
}

app.on('ready', createWindow);

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