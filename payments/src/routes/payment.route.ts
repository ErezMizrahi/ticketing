import { Router } from 'express';
import { chargeWithStripe } from '../controllers/charge.controller';
import { requireAuth, validateRquest, currentUser } from '@erezmiz-npm/tickets-common';
import { body } from 'express-validator';

const router = Router();

router.use(currentUser);
router.post('/', requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], validateRquest, chargeWithStripe);

export { router as paymentRouter }