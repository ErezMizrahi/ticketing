import { Publisher, Subjects, TicketCreatedEvent } from "@erezmiz-npm/tickets-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

}
