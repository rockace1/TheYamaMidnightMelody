import path from 'path';
import moment from 'moment';
import { dialog } from 'electron';

export interface Platform {
    sep(): string;
    name(): string;
    isWin(): boolean;
    isMac(): boolean;
    isLinux(): boolean;
    chooseFile(param: ChooseFileParam): string[] | undefined;
    getDestPath(source: string): string;
}

interface ChooseFileParam {
    name: string,
    ext: string[],
    file?: boolean,
    dir?: boolean,
    multi?: boolean,
    hidden?: boolean,
    defaultPath?: string
}

const sep: string = path.sep;

const platformName: string = process.platform;

function isPlatform(name: string): boolean {
    return platformName === name;
}

const platform: Platform = {
    sep(): string {
        return sep;
    },

    name(): string {
        return platformName;
    },

    isWin(): boolean {
        return isPlatform('win32');
    },

    isMac(): boolean {
        return isPlatform('darwin');
    },

    isLinux(): boolean {
        return isPlatform('linux');
    },

    chooseFile(param: ChooseFileParam): string[] | undefined {
        let properties: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'> = []
        if (param.file !== false) {
            properties.push('openFile');
        }
        if (param.dir) {
            properties.push('openDirectory');
        }
        if (param.multi) {
            properties.push('multiSelections');
        }
        if (param.hidden) {
            properties.push('showHiddenFiles');
        }
        let source: string[] | undefined = dialog.showOpenDialogSync({
            defaultPath: param.defaultPath,
            filters: [{ name: param.name, extensions: param.ext }],
            properties: properties
        });
        return source;
    },

    getDestPath(source: string): string {
        let dir = path.dirname(source);
        let base = path.basename(source, path.extname(source));
        let now = moment().format("YYYYMMDDHHmmss");
        let dest = dir + this.sep() + base + '-' + now + '.xlsx';
        return dest;
    }
}

export default platform;