import { OrderCancelledEvent, Publisher, Subjects } from "@erezmiz-npm/tickets-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}