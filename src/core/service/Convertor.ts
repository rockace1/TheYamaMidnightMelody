import Excel from 'exceljs';
import fs from 'fs';
import path from 'path';
import lineReader from 'readline';
import { Doc } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import Column from '../entity/Column';
import Template from '../entity/Template';

const MAX_ROW: number = 500000;
const SHEET_NAME_PREFIX = 'SHEET_';
const HEADER_FONT = { bold: true, color: { argb: 'ffffff' } };
const HEADER_FILL: Excel.FillPattern = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '252D45' },
};
const HEADER_BORDER: Excel.Border = { style: 'thin', color: { argb: 'cfcecd' } };

const convert = (data: Doc, cb: Function): void => {
    Repo.find(data.tempId).then((temp) => {
        if (temp == null) {
            throw Error('template ' + data.tempId + ' not exist.');
        }
        let source: string = path.normalize(data.source);
        let dest: string = path.normalize(data.dest);
        doConvert(temp, source, dest, cb);
    }).catch((err) => {
        console.error(err);
    });
}

const doConvert = (temp: Template, source: string, dest: string, cb: Function): void => {
    try {
        let columns = temp.getColumns()!;
        let reader: lineReader.Interface = lineReader.createInterface({
            input: fs.createReadStream(source, { encoding: 'utf8' })
        });
        let index = 0;
        let wb = createExcel(dest);
        let sheet: Excel.Worksheet | null = null;
        reader.on('line', (line) => {
            sheet = getSheet(index, wb, sheet, columns);
            index++;
            let cols: Array<any> = lineParser(line, temp.getDelimiter()!, columns);
            let row: Excel.Row = sheet.addRow(cols);
            row.commit();
        });
        reader.on('close', () => {
            if (sheet !== null) {
                sheet.commit();
            }
            wb.commit().then(() => {
                cb();
            });
        });
    } catch (err) {
        console.error('fail!');
    }
}

const lineParser = (data: string, delimiter: string, columns: Array<Column>): Array<any> => {
    let result: Array<any> = [];
    let array: Array<string> = data.split(delimiter);
    for (let i = 0; i < array.length; i++) {
        let value: any = array[i];
        if (value === null || value === undefined || value === '') {
            value = null;
        } else {
            let col = columns[i];
            if (col !== undefined) {
                if (col.getType() === 1) {
                    value = Number(value);
                }
            }
        }
        result.push(value);
    }
    return result;
}

const createExcel = (dest: string): Excel.stream.xlsx.WorkbookWriter => {
    let now = new Date();
    let author = 'QinJi';
    let workbook = new Excel.stream.xlsx.WorkbookWriter({ filename: dest, useStyles: true });
    workbook.creator = author;
    workbook.lastModifiedBy = author;
    workbook.created = now;
    workbook.modified = now;
    workbook.lastPrinted = now;
    return workbook;
}

const getSheet = (index: number, wb: Excel.Workbook, sheet: Excel.Worksheet | null, columns: Array<Column>): Excel.Worksheet => {
    let suffix = Math.floor(index / MAX_ROW);
    let sheetName = SHEET_NAME_PREFIX + suffix;
    if (sheet === null) {
        sheet = createSheet(wb, sheetName, columns);
    } else {
        if (wb.getWorksheet(sheetName) === undefined) {
            sheet.commit();
            sheet = createSheet(wb, sheetName, columns);
        }
    }
    return sheet;
}

const createSheet = (wb: Excel.Workbook, name: string, columns: Array<Column>): Excel.Worksheet => {
    let sheet = wb.addWorksheet(name);
    let sheetColumns = [];
    for (let i = 0; i < columns.length; i++) {
        let col: Column = columns[i];
        let data: { header: string | undefined, width: number, style: { numFmt: string } | undefined } = {
            header: col.getName(),
            width: 9,
            style: undefined
        };
        if (col.getType() === 1) {
            data.style = { numFmt: '0.0000_);(0.0000)' };
        } else if (col.getType() === 2) {
            data.style = { numFmt: '@' };
        }
        sheetColumns.push(data);
    }
    sheet.columns = sheetColumns;
    let row: Excel.Row = sheet.getRow(1);
    row.font = HEADER_FONT;
    row.fill = HEADER_FILL;
    row.border = {
        top: HEADER_BORDER,
        left: HEADER_BORDER,
        bottom: HEADER_BORDER,
        right: HEADER_BORDER
    };
    return sheet;
}

export default { convert }