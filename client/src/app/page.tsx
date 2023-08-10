import InitializeAuthContext from '@/components/context/InitializeAuthContext';
import styles from './page.module.css'
import nextFetch from '@/api/next-fetch';

async function getCurrentUser() {
  const res = await nextFetch({route: '/api/users/currentuser'});
  const data = await res.json();
  return data?.currentUser;
}

export default async function Home() {
  const currentUser = await getCurrentUser();


  return (
    <main className={styles.main}>
      <InitializeAuthContext currentUser={currentUser}/>
     { currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>}
     {currentUser?.email}
    </main>
  )
}
