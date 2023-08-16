import { NotAuthorizedError, NotFoundError } from "@erezmiz-npm/tickets-common";
import { Ticket, TicketAttrs } from "../models/ticket.model";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatePublisher } from "../events/publishers/ticket-update-publisher";

export class TicketService {
    async createTicket(ticket: TicketAttrs) {
        const newTicket = Ticket.build(ticket);
        await newTicket.save();

        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: newTicket.id,
            title: newTicket.title,
            price: newTicket.price,
            userId: newTicket.userId
        });

        return newTicket;
    }

    async getTicket(id: string) {
        const ticket = await Ticket.findById(id);
        if(!ticket) {
            throw new NotFoundError();
        }
        return ticket;
    }

    async getTickets() {
        const tickets = await Ticket.find({});
        return tickets;
    }

   
    async updateTicketById({ id, currentUserId, title, price }: UpdateType) { 
        const ticket = await this.getTicket(id);

        if(ticket.userId !== currentUserId) {
            throw new NotAuthorizedError();
        }

        ticket.set({
           title,
           price 
        });

        await ticket.save();

        new TicketUpdatePublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });
        
        return ticket;
    }
}

type UpdateType = {
    id: string;
    currentUserId: string;
    title: string;
    price: string
}