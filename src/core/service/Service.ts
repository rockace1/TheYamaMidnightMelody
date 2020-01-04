import { init } from '../connection/Rdb';
import Template from '../entity/Template';
import Page from '../entity/Page';
import Result from '../entity/Result';
import { Doc } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import Convertor from './Convertor';
import { Platform } from '../entity/Constant';
import { ipcMain } from 'electron';

const initDatabase = (): void => {
    init();
}

ipcMain.on('convertDoc', (event, data: { index: number, data: Doc }) => {
    try {
        Convertor.convert(data.data, () => {
            let result: Result<void> = Result.getSuccess();
            event.reply('convertDone', { index: data.index, result: result });
        });
    } catch (err) {
        let result: Result<void> = Result.getFail(err.stack);
        event.reply('convertDone', { index: data.index, result: result });
    }
});

ipcMain.on('queryTemplate', (event, param: { pageNum: number, size: number }) => {
    let pageNum = 1;
    if (param.pageNum > 1) {
        pageNum = param.pageNum;
    }
    let size = 10;
    if (param.size > 10) {
        size = param.size;
    }
    Repo.query(pageNum, size).then((data: Page<Template>) => {
        event.returnValue = Result.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    })
});

ipcMain.on('allTemplate', (event) => {
    Repo.all().then((data: Array<Template>) => {
        event.returnValue = Result.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    })
});

ipcMain.on('createTemplate', (event, data: Template) => {
    data = Template.from(data);
    Repo.save(data).then(() => {
        event.returnValue = Result.getSuccess();
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    })
});

ipcMain.on('destroyTemplate', (event, id: number) => {
    Repo.destroy(id).then(() => {
        event.returnValue = Result.getSuccess();
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    })
});

ipcMain.on('updateTemplate', (event, data: Template) => {
    data = Template.from(data);
    let id = data.getId();
    if (id === undefined) {
        throw Error("template id cannot null.")
    }
    Repo.find(id).then((exist) => {
        if (exist === null) {
            throw Error("template " + id + " not exist.");
        }
        Repo.update(data).then(() => {
            event.returnValue = Result.getSuccess();
        }).catch((err) => {
            event.returnValue = Result.getFail(err.stack);
        })
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    });
});

ipcMain.on('findTemplate', (event, id: number) => {
    Repo.find(id).then((data) => {
        event.returnValue = Result.getSuccessWith(data);
    }).catch((err) => {
        event.returnValue = Result.getFail(err.stack);
    })
});

ipcMain.on('getSep', (event) => {
    event.returnValue = Platform.sep();
});

ipcMain.on('isWin', (event) => {
    event.returnValue = Platform.isWin();
});

ipcMain.on('isMac', (event) => {
    event.returnValue = Platform.isMac();
});

ipcMain.on('isLinux', (event) => {
    event.returnValue = Platform.isLinux();
});

export default { initDatabase }