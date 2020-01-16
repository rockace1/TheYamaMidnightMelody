export default class Result<T>{
    success: boolean;
    message?: string;
    data?: T

    constructor(success: boolean, message?: string, data?: T) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static getSuccess(): Result<void> {
        return new Result<void>(true);
    }

    static getEmpty(): Result<void> {
        return new Result<void>(false);
    }

    static getSuccessWith<T>(data: T): Result<T> {
        return new Result<T>(true, undefined, data);
    }

    static getFail<T>(msg: string): Result<T> {
        return new Result<T>(false, msg);
    }
}