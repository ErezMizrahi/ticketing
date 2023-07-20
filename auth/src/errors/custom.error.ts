export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);
        // just because we use a built in class with ts
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serialzeErrors(): {message: string, field?: string}[];
}