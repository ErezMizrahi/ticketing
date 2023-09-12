'use client';
import React, { useEffect, useState } from 'react'
import useRequest from '@/components/hooks/useRequest';
import Link from 'next/link';

interface Ticket {
    title: string;
    price: number;
    userId: string;
    version: number;
    id: string;
}

const TicketList = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'get',
        onSuccess: (tickets) => {
            console.log(tickets);
            setTickets(tickets);
        }
      });

    useEffect(() => {
        doRequest();
    }, [])

  return (
    <div>
        <h1>Tickets</h1>
        <table>
            <thead>
                <tr>
                    <th style={{textAlign: 'left'}}>Title</th>
                    <th style={{textAlign: 'left'}}>Price</th>
                    <th style={{textAlign: 'left'}}>Link</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket.id}>
                        <td style={{padding: 10}}>{ticket.title}</td>
                        <td style={{padding: 10}}>{ticket.price}</td>
                        <td style={{padding: 10}}>
                            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>See Ticket</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default TicketList