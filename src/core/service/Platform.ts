import path from 'path';
import moment from 'moment';
import { dialog } from 'electron';

export interface Platform {
    sep(): string;
    name(): string;
    isWin(): boolean;
    isMac(): boolean;
    isLinux(): boolean;
    chooseFile(): string | undefined;
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

    chooseFile(): string | undefined {
        let source: string[] | undefined = dialog.showOpenDialogSync({
            filters: [{ name: 'TEXT', extensions: ['txt'] }],
            properties: ['openFile']
        });
        if (source && source.length > 0) {
            return source[0];
        }
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