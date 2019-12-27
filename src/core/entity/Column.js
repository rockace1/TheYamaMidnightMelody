"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Column {
    constructor(type, name, tempId) {
        this.type = type;
        this.name = name;
        this.tempId = tempId;
    }
    static from(data) {
        return new Column(data.type, data.name, data.tempId);
    }
    setTempId(v) {
        this.tempId = v;
    }
    getTempId() {
        return this.tempId;
    }
    setName(v) {
        this.name = v;
    }
    getName() {
        return this.name;
    }
    setType(v) {
        this.type = v;
    }
    getType() {
        return this.type;
    }
}
exports.default = Column;
//# sourceMappingURL=Column.js.map