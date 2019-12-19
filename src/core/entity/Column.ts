class Column {

    constructor(name: string, type: number, tempId?: number) {
        this.tempId = tempId;
        this.name = name;
        this.type = type;
    }

    private tempId?: number;
    private name: string;
    private type: number;


    public setTempId(v: number) {
        this.tempId = v;
    }


    public getTempId(): number | undefined {
        return this.tempId;
    }


    public setName(v: string) {
        this.name = v;
    }


    public getName(): string {
        return this.name;
    }


    public setType(v: number) {
        this.type = v;
    }


    public getType(): number {
        return this.type
    }





}

export default Column