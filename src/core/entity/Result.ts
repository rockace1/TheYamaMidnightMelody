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
        let result = new Result<void>(true)
        return result;
    }

    static getSuccessWith<T>(data: T): Result<T> {
        let result = new Result<T>(true, '', data);
        return result;
    }

    static getFail(msg: string): Result<void> {
        let result = new Result<void>(false, msg);
        return result;
    }
}