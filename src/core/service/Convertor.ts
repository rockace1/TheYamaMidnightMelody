import { default as Excel, Workbook, Worksheet, Row, Cell, FillPattern, Border } from 'exceljs';
import fs from 'fs';
import path from 'path';
import lineReader from 'readline';
import { Doc, Template, Column } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import kit from '../common/Kit';
import parser from '../func/Parser';
import serializer from '../func/Serializer';
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
        Repo.find(data.tempId!).then((template) => {
            if (kit.isNull(template)) {
                throw new MelodyException(`template ${data.tempId} not exist.`);
            }
            let source: string = path.normalize(data.source);
            let dest: string = path.normalize(data.dest);
            doConvert(template!, source, dest, callback);
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
            let lineNum = index % MAX_ROW;
            sheet = getSheet(index++, lineNum, wb, sheet, columns);
            let row: Row = sheet.getRow(lineNum + 2);
            parser.parse(row, line, temp, serializer);
            row.commit();
        });
        reader.on('close', () => {
            if (kit.isNotNull(sheet)) {
                sheet!.commit();
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

function getSheet(index: number, lineNum: number, wb: Workbook, sheet: Worksheet | null, columns: Array<Column>): Worksheet {
    if (lineNum === 0) {
        let suffix = Math.floor(index / MAX_ROW);
        let sheetName = SHEET_NAME_PREFIX + suffix;
        if (kit.isNotNull(sheet)) {
            sheet!.commit();
        }
        sheet = createSheet(wb, sheetName, columns);
    }
    return sheet!;
}

function createSheet(wb: Workbook, name: string, columns: Array<Column>): Worksheet {
    let sheet = wb.addWorksheet(name);
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
        cell.style.numFmt = kit.getFmt(col.type);
    }
    return sheet;
}

export default ConvertorImpl;