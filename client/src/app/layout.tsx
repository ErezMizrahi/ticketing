import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/context/AuthContext'
import InitializeAuthContext from '@/components/context/InitializeAuthContext';
import nextFetch from '@/api/next-fetch';
import Header from '@/components/Header';

async function getCurrentUser() {
  const res = await nextFetch({route: '/api/users/currentuser'});
  const data = await res.json();
  return data?.currentUser;
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <InitializeAuthContext currentUser={currentUser}/>
          <Header />
          {children}
        </AuthProvider>

      </body>
    </html>
  )
}
