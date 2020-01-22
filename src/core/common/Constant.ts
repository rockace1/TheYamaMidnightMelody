export interface ColumnType {
    readonly name: string;
    readonly value: number;
}

export enum OptionKey {
    BASE_FOLDER = 1,
    EXT = 2,
    CLEAN = 3,
}

export enum ColumnTypeEnum {
    GENERAL = 0,
    NUM = 1,
    TEXT = 2,
    CURRENCY = 3,
    ACCOUNTING = 4,
    PERCENT = 5,
    FRACTION = 6,
    SCIENTIFIC_NOTATION = 7,
    CUSTOM = 8,
}

const ColumnTypeImpl: ReadonlyArray<ColumnType> = [
    {
        name: "常规",
        value: ColumnTypeEnum.GENERAL,
    }, {
        name: "数值",
        value: ColumnTypeEnum.NUM,
    }, {
        name: "文本",
        value: ColumnTypeEnum.TEXT,
    }, {
        name: "货币",
        value: ColumnTypeEnum.CURRENCY,
    }, {
        name: "会计专用",
        value: ColumnTypeEnum.ACCOUNTING,
    }, {
        name: "百分比",
        value: ColumnTypeEnum.PERCENT,
    }, {
        name: "分数",
        value: ColumnTypeEnum.FRACTION,
    }, {
        name: "科学计数",
        value: ColumnTypeEnum.SCIENTIFIC_NOTATION,
    }, {
        name: "自定义",
        value: ColumnTypeEnum.CUSTOM,
    }
];

export default ColumnTypeImpl;