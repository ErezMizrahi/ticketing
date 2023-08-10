import express from 'express';
import 'express-async-errors';
import { errorHanlder, NotFoundError } from '@erezmiz-npm/tickets-common';
import cookieSession from 'cookie-session';
import { ticketsRouter } from './routes/tickets.route';

const app = express();

//settings
app.set('trust proxy', true); //because the express server is behind ingress and it need to trust the proxy
app.use(cookieSession( {signed: false, secure: process.env.NODE_ENV !== 'test'} ))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/api/tickets', ticketsRouter)
app.all('*', async () => { throw new NotFoundError() });

//error handling
app.use(errorHanlder);

export { app }