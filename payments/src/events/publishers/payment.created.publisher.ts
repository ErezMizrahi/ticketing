import { PaymentCreatedEvent, Publisher, Subjects } from "@erezmiz-npm/tickets-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}