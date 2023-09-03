import { OrderCreatedEvent, Publisher, Subjects } from "@erezmiz-npm/tickets-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}