import { Router } from 'express'
import { getCurrentUser, signin, signout, signup } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

router.get('/currentuser', getCurrentUser);

router.post('/signin', signin);

router.post('/signout', signout);

router.post('/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be betweeb 4-20 characters')
], signup);

export { router as authRoute }