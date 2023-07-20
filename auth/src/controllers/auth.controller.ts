import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { RequestValidationError } from "../errors/requestValidation.error";
import { UserService } from "../services/user.service";

export const getCurrentUser = (req: Request, res: Response) => {
    res.status(200).json({user: 'me'});
}

export const signin = (req: Request, res: Response) => {
    res.status(200).json({user: 'me2'});
}

export const signout = (req: Request, res: Response) => {
    res.status(200).json({user: 'me1'});
}

export const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    console.log('Creating a user...')
    const service = new UserService();
    const user = await service.createUser(email, password);

    res.status(201).json(user);
}