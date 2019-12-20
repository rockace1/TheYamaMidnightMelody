import Column from './Column';

class Template {

    constructor(columns: Array<Column>, name?: string, delimiter?: string, id?: number) {
        this.id = id;
        this.name = name;
        this.delimiter = delimiter;
        this.columns = columns;
    }

    private id?: number;
    private name?: string;
    private delimiter?: string;
    private columns: Array<Column>;
    private readonly date!: Date;


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


    public getDate(): Date {
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

export default Template