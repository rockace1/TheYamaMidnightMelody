import { Row } from 'exceljs';
import MelodyException from '../common/Exception';
import ColumnType from '../common/Constant';
import kit from '../common/Kit';
import { Serializer } from '../func/Serializer';

export interface Parser {
    parse(row: Row, line: string, template: { columns: Array<{ name?: string, type: number }>, delimiter: string }, serializer: Serializer): void;
}

const LineParser: Parser = {
    parse(row: Row, line: string, template: { columns: Array<{ name?: string, type: number }>, delimiter: string }, serializer: Serializer): void {
        try {
            let array: Array<string> = line.split(template.delimiter);
            for (let i = 0; i < array.length; i++) {
                let value: any = array[i];
                if (kit.isBlank(value)) {
                    continue;
                }
                let col = template.columns[i];
                let type = 0;
                if (kit.isNotNull(col)) {
                    type = col.type;
                    if (type === ColumnType[1].value) {
                        value = Number(value);
                    }
                }
                serializer.write(row, type, value, i + 1);
            }
        } catch (err) {
            throw new MelodyException(`parse line[${row.number}] error.`, err);
        }
    }
}

export default LineParser;