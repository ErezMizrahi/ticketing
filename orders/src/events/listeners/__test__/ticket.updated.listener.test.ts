import { TicketUpdatedListener } from "../ticket.updated";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@erezmiz-npm/tickets-common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket.model";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'conecrt',
        price: 20,
    }).save();
    
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'mew concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
}

it('finds, updates, and saves the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (e) { }

    expect(msg.ack).not.toHaveBeenCalled();
});