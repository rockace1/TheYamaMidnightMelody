"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static getSuccess() {
        return new Result(true);
    }
    static getEmpty() {
        return new Result(false);
    }
    static getSuccessWith(data) {
        return new Result(true, undefined, data);
    }
    static getFail(msg) {
        return new Result(false, msg);
    }
}
exports.default = Result;
