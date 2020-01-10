import path from 'path';

export interface Platform {
    sep(): string;
    name(): string;
    isWin(): boolean;
    isMac(): boolean;
    isLinux(): boolean;
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
    }
}

export default platform;