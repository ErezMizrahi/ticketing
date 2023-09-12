"use client";
import { useState } from 'react'
import nextFetch from '@/api/next-fetch'

interface RequestAttr {
    url: string,
    method: "get" | "post",
    body?: any,
    onSuccess?: (response: any) => void
}

const useRequest = ({ url, method, body, onSuccess }: RequestAttr) => {
    const [errors, setErrors] = useState<JSX.Element | null>(null);
 
    const doRequest = async () => {
        try {
            const response = await nextFetch({
                route: url,
                method,
                headersMap: { 'Content-type': 'application/json' },
                body })
            const json = await response.json();
            if (response.ok) {
                if (onSuccess) {
                    onSuccess(json);
                }
                return json;
            }
            if (json.errors) {
                setErrors(
                    <div>
                        <h4>Opps...</h4>
                        <ul>
                            {json.errors?.map((error: Error) => {
                                return <li key={error.message}>{error.message}</li>
                            })}
                        </ul>
                    </div>
                );
            }
        } catch (e) {
            console.log(e)
        }
    }

    return { doRequest, errors };
}

export default useRequest