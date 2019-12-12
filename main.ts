import { app, BrowserWindow } from 'electron';
const appName = require('./package.json').name

let mainWindow: BrowserWindow | null;

const createWindow = () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 768, autoHideMenuBar: true });
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