import { app, BrowserWindow } from 'electron';
const appName = require('./package.json').name

let mainWindow: BrowserWindow | null;

const createWindow = () => {
    let width: number = 1024;
    let height: number = 768;
    mainWindow = new BrowserWindow({ minWidth: width, minHeight: height, width: width, height: height, autoHideMenuBar: true });
    mainWindow.setMenuBarVisibility(false);
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
    })
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