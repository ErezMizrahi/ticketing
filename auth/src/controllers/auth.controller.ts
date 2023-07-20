import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const getCurrentUser = async (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser || null });
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const service = new UserService();
    const existingUser = await service.isUserExists(email, password);
    const token = service.generateJwt({
        id: existingUser.id,
        email: existingUser.email
    });
  
    req.session = {
        jwt: token
    };
    
    res.status(200).json(existingUser);
}

export const signout = (req: Request, res: Response) => {
    req.session = null;
    res.status(200).send();
}

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log('Creating a user...')
    const service = new UserService();
    const user = await service.createUser(email, password);

    const token = service.generateJwt({
        id: user.id,
        email: user.email
    });
  
    req.session = {
        jwt: token
    };

    res.status(201).json(user);
}