import { Doc } from '../../core/entity/Model';
import Result from '../../core/entity/Result';
import messenger from '../router/messenger';

const convert = (data: Doc, index: number): void => {
    window.ipcRenderer.send('convertDoc', { index, data });
}

window.ipcRenderer.on("convertDone", (event, response: { index: number; result: Result<void> }) => {
    messenger.$emit('convertDone', response);
});

const isMac = (): boolean => {
    let result: boolean = window.ipcRenderer.sendSync('isMac');
    return result;
}

const isLinux = (): boolean => {
    let result: boolean = window.ipcRenderer.sendSync('isLinux');
    return result;
}

const isWin = (): boolean => {
    let result: boolean = window.ipcRenderer.sendSync('isWin');
    return result;
}

const getSep = (): string => {
    let result: string = window.ipcRenderer.sendSync('getSep');
    return result;
}

export default { convert, isMac, isLinux, isWin, getSep }
