import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order.created.listener";
import { OrderCreatedEvent, OrderStatus } from "@erezmiz-npm/tickets-common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    }).save()

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sdsdsdsq',
        expiresAt: Date(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, message }
}

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, message } = await setup();
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('publishes ticket updated event', async () => {
    const { listener, data, message } = await setup();
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //@ts-ignore
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
