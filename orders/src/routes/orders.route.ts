import { Router } from 'express';
import { getOrders, patchOrder, getOrder, createOrder } from '../controllers/order.controller';
import { currentUser, requireAuth, validateRquest } from '@erezmiz-npm/tickets-common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
const router = Router();

router.use(currentUser);

router.get('/', requireAuth, getOrders);

router.get('/:orderId',requireAuth, getOrder);

router.patch('/:orderId',requireAuth, patchOrder);

router.post('/', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket id must be provided')
], validateRquest, createOrder);

export { router as ordersRouter }