import path from 'path';
import moment from 'moment';
import { dialog } from 'electron';

export interface Platform {
    sep(): string;
    name(): string;
    isWin(): boolean;
    isMac(): boolean;
    isLinux(): boolean;
    chooseFile(name: string, ext: string[], file: boolean, dir: boolean, multi: boolean, hidden: boolean): string[] | undefined;
    getDestPath(source: string): string;
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

    chooseFile(name: string, ext: string[], file: boolean, dir: boolean, multi: boolean, hidden: boolean, defaultPath?: string): string[] | undefined {
        let properties: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'> = []
        if (file) {
            properties.push('openFile');
        }
        if (dir) {
            properties.push('openDirectory');
        }
        if (multi) {
            properties.push('multiSelections');
        }
        if (hidden) {
            properties.push('showHiddenFiles');
        }
        let source: string[] | undefined = dialog.showOpenDialogSync({
            defaultPath: defaultPath,
            filters: [{ name: name, extensions: ext }],
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