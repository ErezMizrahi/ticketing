import { Router } from 'express'
import { body } from 'express-validator';
import { newTicket, getTicket, getTickets, updateTicket } from '../controllers/tickets.controller';
import { currentUser, requireAuth, validateRquest } from '@erezmiz-npm/tickets-common';

const router =  Router();


router.use(currentUser);

router.get('/', getTickets);
router.get('/:id', getTicket);

router.post('/',requireAuth ,[
    body('title')
    .not()
    .isEmpty()
    .withMessage('title is requierd'),
    body('price')
    .isFloat({ gt: 0 })
    .withMessage('price must be greater than 0')
], validateRquest, newTicket);


router.put('/:id',requireAuth ,[
    body('title')
    .not()
    .isEmpty()
    .withMessage('title is required'),
    body('price')
    .isFloat({ gt: 0 })
    .withMessage('price must be greater than 0')
] , validateRquest, updateTicket);


export { router as ticketsRouter }