import React from 'react'
import nextFetch from '@/api/next-fetch';
import { Order } from '@/types/order';
import Timer from '@/components/Timer';
import StripeCheckout from 'react-stripe-checkout';
import Payment from '@/components/Payment';

interface OrderParams { 
    params: {
        orderId: string;
    }
}


const OrderShow = async ({params: {orderId}}: OrderParams) => {

  const getOrder = async (orderId: string): Promise<Order> => {
    const order = await nextFetch({ route: `./api/orders/${orderId}` });
    return await order.json();
  }
  
  const order = await getOrder(orderId);

  return (
    <div>
      <Timer order={order} />
      <Payment order={order} />
    </div>
  )
}

export default OrderShow