import { default as Excel, Workbook, Worksheet, Row, Cell, FillPattern, Border } from 'exceljs';
import fs from 'fs';
import path from 'path';
import lineReader from 'readline';
import { Doc, Template, Column } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import ColumnType from '../common/Constant';
import parser from '../func/Parser';
import MelodyException from '../common/Exception';

const MAX_ROW: number = 500000;
const SHEET_NAME_PREFIX = 'SHEET_';
const HEADER_FONT = { bold: true, color: { argb: 'ffffff' } };
const HEADER_FILL: FillPattern = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '252D45' },
};
const HEADER_BORDER: Border = { style: 'thin', color: { argb: 'cfcecd' } };

interface Convertor {
    convert(data: Doc, cb: Function): void;
}

const ConvertorImpl: Convertor = {
    convert(data: Doc, callback: Function): void {
        Repo.find(data.tempId).then((template) => {
            if (template == null) {
                throw new MelodyException(`template ${data.tempId} not exist.`);
            }
            let source: string = path.normalize(data.source);
            let dest: string = path.normalize(data.dest);
            doConvert(template, source, dest, callback);
        }).catch((err) => {
            throw new MelodyException(`convert ${data.source} error.`, err);
        });
    }
}

function doConvert(temp: Template, source: string, dest: string, callback: Function): void {
    try {
        let start = new Date().getTime();
        let columns = temp.columns!;
        let reader: lineReader.Interface = lineReader.createInterface({
            input: fs.createReadStream(source, { encoding: 'utf8' })
        });
        let index = 0;
        let wb = createExcel(dest);
        let sheet: Worksheet | null = null;
        reader.on('line', (line) => {
            sheet = getSheet(index++, wb, sheet, columns);
            let cols: Array<any> = parser.parse(index, line, temp);
            let row: Row | null = sheet.addRow(cols);
            for (let i = 0; i < columns.length; i++) {
                let col: Column = columns[i];
                let cell: Cell = row.getCell(i + 1);
                cell.style.numFmt = getFmt(col.type);
            }
            row.commit();
        });
        reader.on('close', () => {
            if (sheet !== null) {
                sheet.commit();
            }
            wb.commit().then(() => {
                let end = new Date().getTime();
                console.log(`run time:${end - start}ms`);
                callback();
            });
        });
    } catch (err) {
        throw new MelodyException(`convert ${source} error.`, err);
    }
}

function createExcel(dest: string): Excel.stream.xlsx.WorkbookWriter {
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

function getSheet(index: number, wb: Workbook, sheet: Worksheet | null, columns: Array<Column>): Worksheet {
    if (index % MAX_ROW === 0) {
        let suffix = Math.floor(index / MAX_ROW);
        let sheetName = SHEET_NAME_PREFIX + suffix;
        if (sheet !== null) {
            sheet.commit();
        }
        sheet = createSheet(wb, sheetName, columns);
    }
    return sheet!;
}

function createSheet(wb: Workbook, name: string, columns: Array<Column>): Worksheet {
    let sheet = wb.addWorksheet(name);
    // let sheetColumns = [];
    // for (let i = 0; i < columns.length; i++) {
    //     let col: Column = columns[i];
    //     let data: { header: string | undefined, width: number, style: { numFmt: string } | undefined } = {
    //         header: col.name,
    //         width: 9,
    //         style: undefined
    //     };
    //     if (col.type === ColumnType[1].value) {
    //         data.style = { numFmt: '0.0000_);(0.0000)' };
    //     } else if (col.type === ColumnType[2].value) {
    //         data.style = { numFmt: ColumnType[2].fmt };
    //     }
    //     sheetColumns.push(data);
    // }
    // sheet.columns = sheetColumns;
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
        cell.style.numFmt = getFmt(col.type);
    }
    return sheet;
}

function getFmt(type: number): string {
    return ColumnType[type].fmt;
}

function getDataFmt(type: number, sourceFmt: string, destFmt: string) {
    let result: { numFmt: string } | undefined;
    switch (type) {
        case 0: {
            result = undefined;
            break;
        }
        case 1: {
            result = { numFmt: ColumnType[1].fmt }
            break;
        }
        case 2: {
            result = { numFmt: ColumnType[2].fmt }
            break;
        }
        default: {
            throw new Error(`illegal column type:${type}`);
        }
    }
    return result;
}

export default ConvertorImpl;