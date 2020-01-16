import MelodyException from '../common/Exception';
import ColumnType from '../common/Constant';

export interface Parser {
    parse(num: number, line: string, template: { columns: Array<{ name?: string, type: number }>, delimiter: string }): Array<any>;
}

const LineParser: Parser = {
    parse(num: number, line: string, template: { columns: Array<{ name?: string, type: number }>, delimiter: string }): Array<any> {
        try {
            let result: Array<any> = [];
            let array: Array<string> = line.split(template.delimiter);
            for (let i = 0; i < array.length; i++) {
                let value: any = array[i];
                if (value === null || value === undefined || value === '') {
                    value = null;
                } else {
                    let col = template.columns[i];
                    if (col !== undefined) {
                        if (col.type === ColumnType[1].value) {
                            value = Number(value);
                        }
                    }
                }
                result.push(value);
            }
            return result;
        } catch (err) {
            throw new MelodyException(`parse line[${num}] error.`, err);
        }
    }
}

export default LineParser;