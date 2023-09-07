import { ExpirationCompleteEvent, OrderStatus } from "@erezmiz-npm/tickets-common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteLisenter } from "../expiration.completed";
import mongoose from "mongoose";
import { Order } from "../../../models/order.model";
import { Ticket } from "../../../models/ticket.model";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteLisenter(natsWrapper.client)
    
    const ticket = Ticket.build({ 
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20 });
    
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdasd',
        expiresAt: new Date(),
        ticket
    });
    
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: new mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg };
}


it('updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits order cancelled event', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})