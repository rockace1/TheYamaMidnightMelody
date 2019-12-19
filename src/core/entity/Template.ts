import Column from './Column';

class Template {

    constructor(name: string, date: Date, columns: Array<Column>, id?: number) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.columns = columns;
    }

    private id?: number;
    private name: string;
    private date: Date;
    private columns: Array<Column>;


    public setId(v: number) {
        this.id = v;
    }


    public getId(): number | undefined {
        return this.id;
    }


    public setName(v: string) {
        this.name = v;
    }


    public getName(): string {
        return this.name;
    }


    public setDate(v: Date) {
        this.date = v;
    }


    public getDate(): Date {
        return this.date;
    }


    public setColumns(v: Array<Column>) {
        this.columns = v;
    }


    public getColumns(): Array<Column> {
        return this.columns;
    }







}

export default Template