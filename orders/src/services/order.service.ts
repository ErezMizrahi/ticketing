import { Ticket, TicketDoc } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from "@erezmiz-npm/tickets-common";
import { OrderCreatedPublisher } from "../events/publishers/order.created";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order.cancelled";

export class OrdersService {
    private readonly EXPERATION_WINDOW_SECONDES: number = 1 * 60;  

    async findTicket(ticketId: string): Promise<TicketDoc> {
        const ticket = await Ticket.findById({ _id: ticketId });
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

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        return order;
    }

    async getAllOrders(currentUserId: string) {
        return await Order.find({ 
            userId: currentUserId
         }).populate('ticket');
    }

    async getOrder(orderId: string, currentUserId: string) {
        const order = await Order.findById({ 
            _id: orderId
         }).populate('ticket');

         if(!order) {
            throw new NotFoundError();
         }

         if(order.userId !== currentUserId) {
            throw new NotAuthorizedError();
         }

         return order;
    }

    async changeOrderToCancel(orderId: string, currentUserId: string) {
        const order = await this.getOrder(orderId, currentUserId);
        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        return order;
    }
}

export const service = new OrdersService();