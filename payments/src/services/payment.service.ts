import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@erezmiz-npm/tickets-common";
import { Order, OrderDoc } from "../models/order.model";
import { stripe } from "../stripe";
import { Payment, PaymentDoc } from "../models/payment.model";
import { PaymentCreatedPublisher } from "../events/publishers/payment.created.publisher";
import { natsWrapper } from "../nats-wrapper";

class PaymentService { 

    async getOrderByUserId(orderId: string, currentUserId: string): Promise<OrderDoc> {
        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== currentUserId) {
            throw new NotAuthorizedError();
        }

        return order;
    }

    async charge(token: string, orderId: string, currentUserId: string): Promise<PaymentDoc> {
        const order = await this.getOrderByUserId(orderId, currentUserId);

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('cannot pay for an cancelled order');
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        return payment;
    }

}

export const paymentService = new PaymentService();