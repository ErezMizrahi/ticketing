'use client'
import AuthForm from '@/components/AuthForm';
import { AuthContext, AuthContextProviderAttr } from '@/components/context/AuthContext';
import { useContext } from 'react';


const Signup = () => {
  const { authState, setCurrentUser } = useContext(AuthContext) as AuthContextProviderAttr;
  return (
    <AuthForm
      authState={'signup'}
    />
  )
}

export default Signup