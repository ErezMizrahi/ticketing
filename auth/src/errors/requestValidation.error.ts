import { ValidationError } from "express-validator";
import { CustomError } from "./custom.error";

export class RequestValidationError extends CustomError {
    public statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // just because we use a built in class with ts
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serialzeErrors() {
        return this.errors.map(err => {
            if(err.type === 'field') {
                return { message: err.msg, field: err.path }
            }

            return { message: err.msg };
        });
    }
}