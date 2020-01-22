import { default as Excel, Workbook, Worksheet, Row, Cell, FillPattern, Border } from 'exceljs';
import { Template, Column } from '../entity/Model';
import kit from '../common/Kit';
import formater from './Formater';

const MAX_ROW: number = 500000;
const SHEET_NAME_PREFIX = 'SHEET_';

export interface Serializer {
    prepare(param: { template: Template, source: string, dest: string }): any;
    write(counter: number, data: any, prepareData: any, template: Template): void;
    finish(prepareData: any, finishCallback: Function): void
}

const SerializerImpl: Serializer = {

    prepare(param: { template: Template, source: string, dest: string }): any {
        let now = new Date();
        let author = 'QinJi';
        let workbook = new Excel.stream.xlsx.WorkbookWriter({ filename: param.dest, useStyles: true });
        workbook.creator = author;
        workbook.lastModifiedBy = author;
        workbook.created = now;
        workbook.modified = now;
        workbook.lastPrinted = now;
        return { workbook: workbook, sheet: null };
    },

    write(counter: number, data: any, initData: any, template: Template): void {
        let lineNum = counter % MAX_ROW;
        initData.sheet = getSheet(counter, lineNum, initData.workbook, initData.sheet, template.columns);
        let row: Row = initData.sheet.getRow(lineNum + 2);
        let array: Array<string> = data.split(template.delimiter);
        for (let i = 0; i < array.length; i++) {
            let value: any = array[i];
            if (kit.isBlank(value)) {
                continue;
            }
            let column = template.columns[i];
            let fmt = undefined;
            if (kit.isNotNull(column)) {
                fmt = column.fmt;
                value = formater.getValue(value, column);
            }
            let cell: Cell = row.getCell(i + 1);
            cell.style.numFmt = fmt;
            cell.value = value;
        }
        row.commit();
    },

    finish(initData: any, finishCallback: Function): void {
        if (kit.isNotNull(initData.sheet)) {
            initData.sheet!.commit();
        }
        initData.workbook.commit().then(() => {
            finishCallback();
        });
    }
}

function getSheet(index: number, lineNum: number, workbook: Workbook, sheet: Worksheet | null, columns: Array<Column>): Worksheet {
    if (lineNum === 0) {
        let suffix = Math.floor(index / MAX_ROW);
        let sheetName = SHEET_NAME_PREFIX + suffix;
        if (kit.isNotNull(sheet)) {
            sheet!.commit();
        }
        sheet = createSheet(workbook, sheetName, columns);
    }
    return sheet!;
}

const HEADER_FONT = { bold: true, color: { argb: 'ffffff' } };
const HEADER_FILL: FillPattern = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '252D45' },
};
const HEADER_BORDER: Border = { style: 'thin', color: { argb: 'cfcecd' } };

function createSheet(workbook: Workbook, name: string, columns: Array<Column>): Worksheet {
    let sheet = workbook.addWorksheet(name);
    let row: Row = sheet.getRow(1);
    row.font = HEADER_FONT;
    row.fill = HEADER_FILL;
    row.border = {
        top: HEADER_BORDER,
        left: HEADER_BORDER,
        bottom: HEADER_BORDER,
        right: HEADER_BORDER
    };
    for (let i = 0; i < columns.length; i++) {
        let col: Column = columns[i];
        let cell: Cell = row.getCell(i + 1);
        if (col.name) {
            cell.value = col.name;
        }
        cell.style.numFmt = col.fmt;
    }
    return sheet;
}

export default SerializerImpl;