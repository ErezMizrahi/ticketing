import nextFetch from '@/api/next-fetch'
import SingleTicket from '@/components/SignleTicket'
import { Ticket } from '@/types/ticket'
import React from 'react'

interface PageParams {
    params: {
        ticketId: string
    }
}

const TicketShow = async ({ params: { ticketId } }: PageParams) => {

    const getTickets = async (ticketId: string): Promise<Ticket> => {
        const res = await nextFetch({route: `/api/tickets/${ticketId}`});
        return await res.json();
    }
    const ticket = await getTickets(ticketId);

    return (
    <div>
        <SingleTicket ticket={ticket} />
    </div>
  )
}

export default TicketShow