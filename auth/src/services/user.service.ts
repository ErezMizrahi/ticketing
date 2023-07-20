import { BadRequestError } from "../errors/badRequest.error";
import { User, UserDocument } from "../models/user.model";

export class UserService {

    async createUser(email: string, password: string): Promise<UserDocument | null> {
            if(await this.isUserExists(email)) {
                throw new BadRequestError('User already exists with this email address');
            }
    
            const user = User.build({
                email,
                password
            });
    
            await user.save();
            console.log(`user ${user}`)
    
            return user;
        
    }

    async isUserExists (email: string) {
        return await User.findOne({ email });
    }
}