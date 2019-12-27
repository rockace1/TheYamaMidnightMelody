export default class Column {

    constructor(type: number, name?: string, tempId?: number) {
        this.type = type;
        this.name = name;
        this.tempId = tempId;
    }

    private tempId?: number;
    private name?: string;
    private type: number;

    static from(data: Column): Column {
        return new Column(data.type, data.name, data.tempId);
    }

    public setTempId(v: number) {
        this.tempId = v;
    }


    public getTempId(): number | undefined {
        return this.tempId;
    }


    public setName(v: string) {
        this.name = v;
    }


    public getName(): string | undefined {
        return this.name;
    }


    public setType(v: number) {
        this.type = v;
    }


    public getType(): number {
        return this.type
    }

}
