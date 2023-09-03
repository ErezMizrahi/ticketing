import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@erezmiz-npm/tickets-common";
import { Ticket } from "../../models/ticket.model";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price } = data;
        const ticket = await Ticket.findByEvent(data)

        if(!ticket) {
            throw new Error('ticket not found');
        }

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}