import React from 'react'
import styles from './styles/AuthForm.module.css';
import useForm from '@/components/hooks/useForm';
import useRequest from '@/components/hooks/useRequest';
import { useRouter } from 'next/navigation';

interface AuthFormAttr {
    authState: "signin" | "signup"
}

const AuthForm = ({ authState }: AuthFormAttr) => {
    const router = useRouter();
    const {state, onValueChange} = useForm({initialState: {email: '', password:''}});
    
    const title = authState === "signin" ? "Sign In" : "Sign Up";
    const url = authState === "signin" ? "/api/users/signin" : "/api/users/signup";
    const navigateTo = authState === "signin" ? "/" : "/";


    const {doRequest, errors} = useRequest({
      url,
      method: 'post',
      body: state,
      onSuccess: (response) => {
        router.push(navigateTo);
        router.refresh();
      } 
    });
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await doRequest();
      
    }
  return (
    <form className={styles.form} onSubmit={onSubmit}>
    <h1>{ title }</h1>
    <div className='form-control'>
      <input name='email' value={state.email} onChange={onValueChange} className='form-control' placeholder='Email Address ...' />
    </div>
    <div className='form-control'>
      <input name='password' value={state.password} onChange={onValueChange} type='password' className='form-control' placeholder='Password ...' />
    </div>
    {errors}
    <button>{ title }</button>
  </form>
  )
}

export default AuthForm