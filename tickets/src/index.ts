import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    try {
        if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend');
        if(!process.env.MOMGO_URI) throw new Error('MOMGO_URI must be defiend');

        await mongoose.connect(process.env.MOMGO_URI);
        console.log('connected to mongodb');

        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
    } catch (e) {
        console.error(e)
    }
}


start();