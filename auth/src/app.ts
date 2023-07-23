import express from 'express';
import 'express-async-errors';
import { authRoute } from './routes/auth.route';
import { errorHanlder } from './middlewares/error.middleware';
import { NotFoundError } from './errors/notFound.error';
import cookieSession from 'cookie-session';

const app = express();

//settings
app.set('trust proxy', true); //because the express server is behind ingress and it need to trust the proxy
app.use(cookieSession( {signed: false, secure: process.env.NODE_ENV !== 'test'} ))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/api/users', authRoute);
app.all('*', async () => { throw new NotFoundError() });

//error handling
app.use(errorHanlder);

export { app }