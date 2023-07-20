import express from 'express';
import 'express-async-errors';
import { authRoute } from './routes/auth.route';
import { errorHanlder } from './middlewares/error.middleware';
import { NotFoundError } from './errors/notFound.error';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/users', authRoute);
app.all('*', async () => { throw new NotFoundError() });

//error handling
app.use(errorHanlder);

const start = async () => {
    try {
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