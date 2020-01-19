import ColumnType from './Constant';

const Kit = {
    isNull(arg: any): boolean {
        return arg === null || arg === undefined
    },
    isNotNull(arg: any): boolean {
        return !this.isEmpty(arg);
    },
    isBlank(str: string): boolean {
        if (this.isNull(str)) {
            return true;
        }
        return str.trim() === "";
    },
    isNotBlank(str: string): boolean {
        return !this.isBlank(str);
    },
    isEmpty(array: any[]): boolean {
        if (this.isNull(array)) {
            return true;
        }
        return array.length === 0;
    },
    isNotEmpty(array: any[]): boolean {
        return !this.isEmpty(array);
    },
    getFmt(type: number): string {
        return ColumnType[type].fmt;
    }
}

export default Kit;