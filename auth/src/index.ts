import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    console.log('starting up');
    try {
        if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend');
        if(!process.env.MONGO_URI) throw new Error('MONGO_URI must be defiend');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to mongodb');

        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
    } catch (e) {
        console.error(e)
    }
}


start();