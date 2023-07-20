import { CustomError } from "./custom.error";

export class DatabaseConnectionError extends CustomError {
    public statusCode = 500;
    private reason = 'Error connecting to the databse';
    constructor() {
        super('Error connecting to the databse');

        // just because we use a built in class with ts
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serialzeErrors() {
        return [
            { message: this.reason }
        ];
    }
}