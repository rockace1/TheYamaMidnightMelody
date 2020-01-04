import path from 'path';
const ColumnType: Array<{ name: string; value: number }> = [
    {
        name: "常规",
        value: 0
    }, {
        name: "数值",
        value: 1
    }, {
        name: "文本",
        value: 2
    }
];

const sep: string = path.sep;
const platformString: string = process.platform;
const isPlatform = (name: string): boolean => {
    return platformString === name;
}

const Platform = {
    sep: (): string => {
        return sep;
    },

    name: (): string => {
        return platformString;
    },

    isWin: (): boolean => {
        return isPlatform('win32');
    },

    isMac: (): boolean => {
        return isPlatform('darwin');
    },

    isLinux: (): boolean => {
        return isPlatform('linux');
    },
}

export { ColumnType, Platform }