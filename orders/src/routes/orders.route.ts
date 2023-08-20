import { Router } from 'express';
import { getOrders, deleteOrder, getOrder, createOrder } from '../controllers/order.controller';
import { currentUser, requireAuth, validateRquest } from '@erezmiz-npm/tickets-common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
const router = Router();

router.use(currentUser);

router.get('/', getOrders);

router.get('/:id', getOrder);

router.delete('/:id', deleteOrder);

router.post('/', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket id must be provided')
], validateRquest, createOrder);

export { router as ordersRouter }