import { Publisher, Subjects, TicketUpdatedEvent } from "@erezmiz-npm/tickets-common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    
}