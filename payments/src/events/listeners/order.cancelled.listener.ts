import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@erezmiz-npm/tickets-common";
import { queueGroupName } from "./queue.group.name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByEvent(data);

        if(!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}