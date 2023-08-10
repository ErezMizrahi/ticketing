import React, { useState } from 'react'

interface FormAttr {
    initialState: any
}
const useForm = ({initialState}: FormAttr) => {
    const [state, setState] = useState(initialState);

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, [e.target.name]: e.target.value})
    }

    return {state ,onValueChange};
}

export default useForm