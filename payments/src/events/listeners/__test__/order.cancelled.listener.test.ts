import { OrderCancelledEvent, OrderStatus } from "@erezmiz-npm/tickets-common";
import { OrderCancelledListener } from "../order.cancelled.listener";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order.model";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'asdasd',
        price: 10,
        version: 0
     });

     await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: '213123'
        }
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message }
}


it('update the status of the order', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});