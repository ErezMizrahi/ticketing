'use client'
import React, { useState } from 'react'
import useRequest from '@/components/hooks/useRequest';
import { useRouter } from "next/navigation";

const New = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => {
      router.push('/')
      router.refresh();
    }
  })
  const onBlur = () => {
    const value = parseFloat(price);
    
    if(isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doRequest();
  }

  return (
    <div>
      <form className='form' onSubmit={onSubmit}>
      <h1>Create a Ticket</h1>

        <div className='form-group'>
          <h3>Title</h3>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='form-group'>
          <h3>Price</h3>
          <input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={onBlur} />
        </div>

        {errors}
        <button>Submit</button>
      </form>
    </div>
  )
}

export default New