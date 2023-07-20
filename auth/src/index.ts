import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    try {
        if(!process.env.JWT_KEY) throw new Error('JWT key env must be set');
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('connected to mongodb');

        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
    } catch (e) {
        console.error(e)
    }
}


start();