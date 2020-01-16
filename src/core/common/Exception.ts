export default class MelodyException extends Error {

    constructor(message: string, err?: Error) {
        super(message);
        if (err) {
            if (err instanceof MelodyException) {
                this.message = err.message;
            }
            this.stack = err.stack;
        }
    }
}