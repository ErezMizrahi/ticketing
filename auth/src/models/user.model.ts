import {model, Schema, Model, Document } from "mongoose";
import { PassowrdService } from "../services/password.service";

//interface that desribe the props to create a new user 
interface UserAttrs { 
    email: string,
    password: string
}

//an interface that desbribe the props that a model has
interface UserModel extends Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument
}

// interface that describe the props that a document has
export interface UserDocument extends Document{ 
    email: string,
    password: string
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashedPassword = await PassowrdService.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = model<UserDocument, UserModel>('user', userSchema);

export { User };
