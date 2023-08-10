'use client'

import useRequest from "@/components/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Signout = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      router.push('/')
      router.refresh();

    }
  });

  useEffect(() => {
    doRequest();
  }, [])

  return (
    <div>signin out...</div>
  )
}

export default Signout