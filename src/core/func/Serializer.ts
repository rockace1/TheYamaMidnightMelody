import { Row, Cell } from 'exceljs';
import kit from '../common/Kit';

export interface Serializer {
    write(row: Row, type: number, value: any, index: number): void;
}

const SerializerImpl: Serializer = {

    write(row: Row, type: number, value: any, index: number): void {
        let cell: Cell = row.getCell(index);
        cell.style.numFmt = kit.getFmt(type);
        cell.value = value;
    }
}

export default SerializerImpl;