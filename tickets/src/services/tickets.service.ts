import { NotAuthorizedError, NotFoundError } from "@erezmiz-npm/tickets-common";
import { Ticket, TicketAttrs } from "../models/ticket.model";

export class TicketService {
    async createTicket(ticket: TicketAttrs) {
        const newTicket = Ticket.build(ticket);
        return await newTicket.save();
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
        return ticket;
    }
}

type UpdateType = {
    id: string;
    currentUserId: string;
    title: string;
    price: string
}