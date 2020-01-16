export interface Serializer {
    parse(num: number, line: string, template: { columns: Array<{ name?: string, type: number }>, delimiter: string }): Array<any>;
}