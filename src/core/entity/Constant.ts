export interface ColumnType {
    readonly name: string;
    readonly value: number;
}

const ColumnTypeImpl: ReadonlyArray<ColumnType> = [
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

export default ColumnTypeImpl;