'use client';
import { Order } from '@/types/order';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, AuthContextProviderAttr } from './context/AuthContext';

interface TimerProps { 
    order: Order;
}
const Timer = ({order}: TimerProps) => {
    const [time, setTime] = useState(0);
    const { authState } = useContext(AuthContext) as AuthContextProviderAttr

    useEffect(() => {
        const findTimeLeft = () => {
            const ms = new Date(order.expiresAt).getTime() - new Date().getTime();
            setTime(Math.round(ms / 1000));
        } 

        findTimeLeft();
        const intervalId = setInterval(findTimeLeft, 1000);
        return () => clearInterval(intervalId);
    }, [time])

    if(time < 0) {
        return <div>Order Expired</div>
    }

  return (
    <div>
        Time left to pay {time} 
        ${authState.email}
     </div>
  )
}

export default Timer