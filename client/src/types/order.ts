import { Ticket } from "./ticket";

export interface Order { 
    userId: string,
    status: string,
       expiresAt: string,
       ticket: Ticket,
       id: string
}