"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const exceljs_1 = tslib_1.__importDefault(require("exceljs"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const readline_1 = tslib_1.__importDefault(require("readline"));
const TemplateRepo_1 = tslib_1.__importDefault(require("../repo/TemplateRepo"));
const MAX_ROW = 500000;
const SHEET_NAME_PREFIX = 'SHEET_';
const HEADER_FONT = { bold: true, color: { argb: 'ffffff' } };
const HEADER_FILL = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '252D45' },
};
const HEADER_BORDER = { style: 'thin', color: { argb: 'cfcecd' } };
const convert = (data, cb) => {
    TemplateRepo_1.default.find(data.tempId).then((temp) => {
        if (temp == null) {
            throw Error('template ' + data.tempId + ' not exist.');
        }
        let source = path_1.default.normalize(data.source);
        let dest = path_1.default.normalize(data.dest);
        doConvert(temp, source, dest, cb);
    }).catch((err) => {
        console.log(err);
    });
};
const doConvert = (temp, source, dest, cb) => {
    try {
        let columns = temp.getColumns();
        let reader = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(source, { encoding: 'utf8' })
        });
        let index = 0;
        let wb = createExcel(dest);
        let sheet = null;
        reader.on('line', (line) => {
            sheet = getSheet(index, wb, sheet, columns);
            index++;
            let cols = lineParser(line, temp.getDelimiter(), columns);
            let row = sheet.addRow(cols);
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
    }
    catch (err) {
        console.log('fail!');
    }
};
const lineParser = (data, delimiter, columns) => {
    let result = [];
    let array = data.split(delimiter);
    for (let i = 0; i < array.length; i++) {
        let value = array[i];
        if (value === null || value === undefined || value === '') {
            value = null;
        }
        else {
            let col = columns[i];
            if (col !== undefined) {
                switch (col.getType()) {
                    case 1:
                        {
                            value = Number(value);
                            break;
                        }
                        ;
                    case 2: {
                        value = '\'' + value;
                        break;
                    }
                }
            }
        }
        result.push(value);
    }
    return result;
};
const createExcel = (dest) => {
    let now = new Date();
    let author = 'QinJi';
    let workbook = new exceljs_1.default.stream.xlsx.WorkbookWriter({ filename: dest, useStyles: true });
    workbook.creator = author;
    workbook.lastModifiedBy = author;
    workbook.created = now;
    workbook.modified = now;
    workbook.lastPrinted = now;
    return workbook;
};
const getSheet = (index, wb, sheet, columns) => {
    let suffix = Math.floor(index / MAX_ROW);
    let sheetName = SHEET_NAME_PREFIX + suffix;
    if (sheet === null) {
        sheet = createSheet(wb, sheetName, columns);
    }
    else {
        if (wb.getWorksheet(sheetName) === undefined) {
            sheet.commit();
            sheet = createSheet(wb, sheetName, columns);
        }
    }
    return sheet;
};
const createSheet = (wb, name, columns) => {
    let sheet = wb.addWorksheet(name);
    let sheetColumns = [];
    for (let i = 0; i < columns.length; i++) {
        sheetColumns.push({
            header: columns[i].getName(),
        });
    }
    sheet.columns = sheetColumns;
    let row = sheet.getRow(1);
    row.font = HEADER_FONT;
    row.fill = HEADER_FILL;
    row.border = {
        top: HEADER_BORDER,
        left: HEADER_BORDER,
        bottom: HEADER_BORDER,
        right: HEADER_BORDER
    };
    return sheet;
};
exports.default = { convert };
