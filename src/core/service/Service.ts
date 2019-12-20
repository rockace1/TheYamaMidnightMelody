import { init } from '../connection/Rdb';
import Template from '../entity/Template';
import Column from '../entity/Column';
import Page from '../entity/Page';
import Repo from '../repo/TemplateRepo';
import { ipcMain } from 'electron';

const initDatabase = (): void => {
    init();
}

ipcMain.on('queryTemplate', (event, args) => {
    let pageNum = 1;
    if (args.pageNum > 1) {
        pageNum = args.pageNum;
    }
    let size = 10;
    if (args.size > 10 && args.size < 100) {
        size = args.size;
    }
    Repo.query(pageNum, size).then((data) => {
        event.returnValue = data;
        console.log('return data:',data);
    }).catch((err) => {
        console.error(err);
    })
});

export default { initDatabase }