import Column from './Column';
import moment from 'moment';

export default class Template {

    constructor(columns: Array<Column>, name?: string, delimiter?: string, id?: number, date?: Date) {
        this.id = id;
        this.name = name;
        this.delimiter = delimiter;
        this.columns = columns;
        this.date = date;
    }

    private id?: number;
    private name?: string;
    private delimiter?: string;
    private columns: Array<Column>;
    private date?: Date;

    static from(data: Template): Template {
        let result: Template = new Template([]);
        result.id = data.id;
        result.name = data.name;
        result.delimiter = data.delimiter;
        result.date = data.date;
        for (let c of data.columns) {
            result.columns.push(Column.from(c));
        }
        return result;
    }

    public setId(v: number) {
        this.id = v;
    }


    public getId(): number | undefined {
        return this.id;
    }


    public setName(v: string) {
        this.name = v;
    }


    public getName(): string | undefined {
        return this.name;
    }


    public getDate(): Date | undefined {
        return this.date;
    }


    public setColumns(v: Array<Column>) {
        this.columns = v;
    }


    public getColumns(): Array<Column> {
        return this.columns;
    }


    public setDelimiter(v: string) {
        this.delimiter = v;
    }


    public getDelimiter(): string | undefined {
        return this.delimiter;
    }

}