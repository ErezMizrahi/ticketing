import { ExpirationCompleteEvent, Publisher, Subjects } from "@erezmiz-npm/tickets-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
