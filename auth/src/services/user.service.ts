import { BadRequestError } from "@erezmiz-npm/tickets-common";
import { User, UserDocument } from "../models/user.model";
import jwt from "jsonwebtoken";
import { PassowrdService } from "./password.service";

interface JWTAttrs {
    id: string,
    email: string
}

export class UserService {

    generateJwt (payload: JWTAttrs): string {
        return jwt.sign(payload , process.env.JWT_KEY!);
    }

    async createUser(email: string, password: string): Promise<UserDocument> {
            if(await this.findUser(email)) {
                throw new BadRequestError('User already exists with this email address');
            }
    
            const user = User.build({
                email,
                password
            });
    
            await user.save();
            return user;
        
    }

    private async findUser (email: string): Promise<UserDocument | null> {
        return await User.findOne({ email });
    }

    async isUserExists(email: string, password: string): Promise<UserDocument> {
        const user = await this.findUser(email);
        if(!user) {
            throw new BadRequestError('Invalid login credentials');
        }

        if(!await PassowrdService.compare(user.password, password)) {
            throw new BadRequestError('Invalid login credentials');
        }

        return user;
    }
}