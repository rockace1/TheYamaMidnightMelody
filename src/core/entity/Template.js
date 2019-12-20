"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Template {
    constructor(columns, name, delimiter, id) {
        this.id = id;
        this.name = name;
        this.delimiter = delimiter;
        this.columns = columns;
    }
    setId(v) {
        this.id = v;
    }
    getId() {
        return this.id;
    }
    setName(v) {
        this.name = v;
    }
    getName() {
        return this.name;
    }
    getDate() {
        return this.date;
    }
    setColumns(v) {
        this.columns = v;
    }
    getColumns() {
        return this.columns;
    }
    setDelimiter(v) {
        this.delimiter = v;
    }
    getDelimiter() {
        return this.delimiter;
    }
}
exports.default = Template;
//# sourceMappingURL=Template.js.map