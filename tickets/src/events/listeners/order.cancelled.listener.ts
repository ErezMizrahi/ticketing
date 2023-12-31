import { Listener, OrderCancelledEvent, Subjects } from "@erezmiz-npm/tickets-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatePublisher } from "../publishers/ticket-update-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: undefined });

        await ticket.save();

        await new TicketUpdatePublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}