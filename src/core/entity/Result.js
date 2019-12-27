"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static getSuccess() {
        let result = new Result(true);
        return result;
    }
    static getSuccessWith(data) {
        let result = new Result(true, '', data);
        return result;
    }
    static getFail(msg) {
        let result = new Result(false, msg);
        return result;
    }
}
exports.default = Result;
//# sourceMappingURL=Result.js.map