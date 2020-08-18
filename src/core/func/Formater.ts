import { Column } from '../entity/Model';
import { ColumnTypeEnum } from '../common/Constant';
import kit from '../common/Kit';

function getDigitsStr(num: string, padding: string): string {
    let decimalPlaces = Number(num);
    let mutable = '';
    for (let i = 0; i < decimalPlaces; i++) {
        mutable += padding;
    }
    if (decimalPlaces > 0) {
        mutable = '.' + mutable;
    }
    return mutable;
}

const Formater = {
    getFmt(column: Column): string {
        let fmt;
        let type = column.type;
        switch (type) {
            case ColumnTypeEnum.GENERAL: {
                fmt = 'General';
                break;
            }
            case ColumnTypeEnum.NUM: {
                let prop = JSON.parse(column.prop_str!);
                let mutable = getDigitsStr(prop.decimalPlaces, '0');
                fmt = `0${mutable}_);(0${mutable})`;
                break;
            }
            case ColumnTypeEnum.TEXT: {
                fmt = '@';
                break;
            }
            case ColumnTypeEnum.CURRENCY: {
                let prop = JSON.parse(column.prop_str!);
                let symbol = prop.symbol;
                let mutable = getDigitsStr(prop.decimalPlaces, '0');
                fmt = `${symbol}#,##0${mutable};${symbol}-#,##0${mutable}`;
                break;
            }
            case ColumnTypeEnum.ACCOUNTING: {
                let prop = JSON.parse(column.prop_str!);
                let symbol = prop.symbol;
                let mutable = getDigitsStr(prop.decimalPlaces, '0');
                fmt = `_ ${symbol}* #,##0${mutable}_ ;_ ${symbol}* -#,##0${mutable}_ ;_ ${symbol}* "-"??_ ;_ @_ `;
                break;
            }
            case ColumnTypeEnum.PERCENT: {
                let prop = JSON.parse(column.prop_str!);
                let mutable = getDigitsStr(prop.decimalPlaces, '0');
                fmt = `0${mutable}%`;
                break;
            }
            case ColumnTypeEnum.FRACTION: {
                let prop = JSON.parse(column.prop_str!);
                let mutable = getDigitsStr(prop.digits, '?');
                if (mutable === '') {
                    fmt = `# ?/?`;
                } else {
                    fmt = `# ${mutable}/${mutable}`;
                }
                break;
            }
            case ColumnTypeEnum.SCIENTIFIC_NOTATION: {
                let prop = JSON.parse(column.prop_str!);
                let mutable = getDigitsStr(prop.decimalPlaces, '0');
                fmt = `0${mutable}E+00`;
                break;
            }
            case ColumnTypeEnum.CUSTOM: {
                fmt = column.fmt!;
                break;
            }
            default: {
                fmt = 'General';
                break;
            }
        }
        return fmt;
    },

    getValue(value: any, column: Column): any {
        if (kit.isNotNull(value)) {
            let type = column.type;
            if (type === ColumnTypeEnum.NUM
                || type === ColumnTypeEnum.CURRENCY
                || type === ColumnTypeEnum.ACCOUNTING
                || type === ColumnTypeEnum.PERCENT
                || type === ColumnTypeEnum.FRACTION
                || type === ColumnTypeEnum.SCIENTIFIC_NOTATION) {
                return Number(value);
            } else if (type === ColumnTypeEnum.CUSTOM) {
                let prop = JSON.parse(column.prop_str!);
                if (prop.isNum === '1' && kit.isNotNull(value)) {
                    return Number(value);
                }
            }
        }
        return value;
    }
}

export default Formater;