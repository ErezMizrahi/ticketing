import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom.error";

export const errorHanlder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError) {
        res.status(err.statusCode).json({ errors: err.serialzeErrors() });
        return;
    }
  

    res.status(400).json({ errors: [{ message: err.message }] });
}