"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Column_1 = tslib_1.__importDefault(require("./Column"));
class Template {
    constructor(columns, name, delimiter, id, date) {
        this.id = id;
        this.name = name;
        this.delimiter = delimiter;
        this.columns = columns;
        this.date = date;
    }
    static from(data) {
        let result = new Template([]);
        result.id = data.id;
        result.name = data.name;
        result.delimiter = data.delimiter;
        result.date = data.date;
        for (let c of data.columns) {
            result.columns.push(Column_1.default.from(c));
        }
        return result;
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
