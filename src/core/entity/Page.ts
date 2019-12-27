export default class Page<T> {
    private rows: Array<T>;
    private count: number;
    private page: number = 1;
    private pageCount: number = 0;
    private pageSize: number = 10;

    constructor(data: { rows: Array<T>, count: number }) {
        this.rows = data.rows;
        this.count = data.count;
    }

    static from(data: Page<any>, supplier: Function): Page<any> {
        let p = new Page({ rows: new Array(), count: 0 });
        p.count = data.count;
        p.page = data.page;
        p.pageSize = data.pageSize;
        for (let t of data.rows) {
            p.rows.push(supplier(t));
        }
        return p;
    }

    setCurrent(page: number): void {
        if (page < 1) {
            page = 1;
        }
        this.page = page;
    }

    setSize(size: number): void {
        if (size < 1) {
            size = 1;
        }
        this.pageSize = size;
    }

    getCurrent(): number {
        return this.page;
    }

    getCount(): number {
        return this.count;
    }

    getData(): Array<T> {
        return this.rows;
    }

    getTotal(): number {
        let num = Math.floor(this.count / this.pageSize);
        if (this.count % this.pageSize === 0) {
            this.pageCount = num;
        } else {
            this.pageCount = num + 1;
        }
        return this.pageCount;
    }
}