import { BadRequestError, ExpirationCompleteEvent, Listener, Subjects, OrderStatus } from "@erezmiz-npm/tickets-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order.cancelled";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteLisenter extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw new Error('order not found');
        }

        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled
        });
        
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}