import React from 'react'

interface OrderParams { 
    params: {
        orderId: string;
    }
}

const OrderShow = ({ params : { orderId: string }}: OrderParams) => {
  return (
    <div>OrderShow</div>
  )
}

export default OrderShow