import { Router } from 'express'
import { getCurrentUser, signin, signout, signup } from '../controllers/auth.controller';
import { body } from 'express-validator';
import { validateRquest } from '../middlewares/validateRequest.middleware';
import { currentUser } from '../middlewares/currentUser.middleware';

const router = Router();

router.get('/currentuser', currentUser, getCurrentUser);

router.post('/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must apply a password')
], validateRquest, signin);

router.post('/signout', signout);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be betweeb 4-20 characters')
], validateRquest, signup);

export { router as authRoute }