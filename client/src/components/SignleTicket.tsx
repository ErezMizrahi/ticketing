'use client';
import { Ticket } from '@/types/ticket';
import React from 'react'
import useRequest from './hooks/useRequest';
import { useRouter } from 'next/router';

interface TicketProps {
  ticket: Ticket
}

const SingleTicket = ({ticket : { id, title, price}} : TicketProps) => {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: id
    },
    onSuccess: (order) => router.push('/orders/[orderId]', `/orders/${order.id}`)
  })

  return (
    <div>
        <h3>{title}</h3>
        <h3>Price: {price}</h3>
        <button onClick={doRequest}> Purchase</button>
    </div>
  )
}

export default SingleTicket