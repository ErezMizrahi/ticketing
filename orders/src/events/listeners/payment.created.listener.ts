import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@erezmiz-npm/tickets-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new NotFoundError();
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
}