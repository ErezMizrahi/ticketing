import { Ticket, TicketDoc } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { BadRequestError, NotFoundError, OrderStatus } from "@erezmiz-npm/tickets-common";

export class OrdersService {
    private readonly EXPERATION_WINDOW_SECONDES: number = 15 * 60;  

    async findTicket(ticketId: string): Promise<TicketDoc> {
        const ticket = await Ticket.findById({ id: ticketId });
        if(!ticket) {
            throw new NotFoundError();
        }

        return ticket;
    }

    async createAnOrder(ticketId: string, currentUserId: string) {
        const ticket = await this.findTicket(ticketId);
        const isReserved = await ticket.isReserved();

        if(isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + this.EXPERATION_WINDOW_SECONDES);

        const order = Order.build({
            userId: currentUserId,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();
        return order;
    }

}

export const service = new OrdersService();