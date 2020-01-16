export interface ColumnType {
    readonly name: string;
    readonly value: number;
    readonly fmt: string;
}

export enum OptionKey {
    BASE_FOLDER = 1,
    EXT = 2,
}

const ColumnTypeImpl: ReadonlyArray<ColumnType> = [
    {
        name: "常规",
        value: 0,
        fmt: 'General'
    }, {
        name: "数值",
        value: 1,
        fmt: '0.0000_);(0.0000)'
    }, {
        name: "文本",
        value: 2,
        fmt: '@'
    }
];

export default ColumnTypeImpl;