'use client';
import { Order } from '@/types/order';
import React, { useContext } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { AuthContext, AuthContextProviderAttr } from './context/AuthContext';
import useRequest from './hooks/useRequest';
import { useRouter } from 'next/navigation'

interface PaymentProps { 
    order: Order
}
const Payment = ({order}: PaymentProps) => {
    const router = useRouter();
    const { authState } = useContext(AuthContext) as AuthContextProviderAttr
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => { router.push('/orders'); router.refresh(); }
    });

  return (
    <>
    <StripeCheckout
    token={({ id }) => doRequest({ token: id })}
    stripeKey={'pk_test_51Nok3dCnPH2CfTaznhibVFmGj0gHg8jHgS3WxOa2JEY16uMIYuOjwpuE6tnUlVb1WOOgGXhf1bHnk39tKspY8cJ0005VC4qSpR'}
    amount={order.ticket.price * 100}
    email={authState.email}
 />

 {errors}
 </>
  )
}

export default Payment