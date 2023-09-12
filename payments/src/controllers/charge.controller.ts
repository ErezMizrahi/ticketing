import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';

export const chargeWithStripe = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const currentUserId = req.currentUser!.id;

    const payment = await paymentService.charge(token, orderId, currentUserId);
    res.status(201).send({ id: payment.id });
}