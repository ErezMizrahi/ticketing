'use client'
import { AuthContext, AuthContextProviderAttr } from './AuthContext';
import { useRef, useContext, useEffect } from 'react'

const InitializeAuthContext = ({currentUser}: {currentUser: any}) => {
    const { authState, setCurrentUser } = useContext(AuthContext) as AuthContextProviderAttr
    const initialized = useRef<boolean>(false);

    useEffect(() => {
        if(!initialized.current) {
            setCurrentUser(currentUser);
            initialized.current = true;
        }
    }, [])
  
  return null;
}

export default InitializeAuthContext