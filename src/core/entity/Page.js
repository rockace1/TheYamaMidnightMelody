"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Page {
    constructor(data) {
        this.page = 1;
        this.pageSize = 10;
        this.rows = data.rows;
        this.count = data.count;
    }
    setCurrent(page) {
        if (page < 1) {
            page = 1;
        }
        this.page = page;
    }
    setSize(size) {
        if (size < 1) {
            size = 1;
        }
        this.pageSize = size;
    }
    getCurrent() {
        return this.page;
    }
    getData() {
        return this.rows;
    }
    getTotal() {
        let num = Math.floor(this.count / this.pageSize);
        if (this.count % this.pageSize === 0) {
            this.pageCount = num;
        }
        else {
            this.pageCount = num + 1;
        }
        return this.pageCount;
    }
}
exports.default = Page;
//# sourceMappingURL=Page.js.map