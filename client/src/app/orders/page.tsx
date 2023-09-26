import nextFetch from '@/api/next-fetch';
import { Order } from '@/types/order';
import React from 'react'

const MyOrders = async () => {
    const getOrders = async () => {
        const res = await nextFetch({route: `/api/orders`});
        return await res.json();
    }

    const orders = await getOrders();

  return (
    <ul>
        {orders.map((order: Order) => (
            <li key={order.id}> { order.ticket.title } - { order.status }</li>
        ))}
    </ul>
  )
}

export default MyOrders