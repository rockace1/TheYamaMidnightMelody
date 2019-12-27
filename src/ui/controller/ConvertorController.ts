import { Doc } from '../model/Model';
import Result from '../../core/entity/Result';
import messenger from '../router/messenger';

const convert = (data: Doc, index: number): void => {
    window.ipcRenderer.send('convertDoc', { index, data });
}

window.ipcRenderer.on("convertDone", (event, response: { index: number; result: Result<void> }) => {
    messenger.$emit('convertDone', response);
});

export default { convert }
