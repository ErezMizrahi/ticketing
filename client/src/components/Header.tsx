'use client';
import { useContext, useEffect, useMemo } from 'react'
import { AuthContext, AuthContextProviderAttr } from './context/AuthContext'
import Link from 'next/link';
import styles from './styles/Header.module.css';

const Header = () => {
    console.log('re render header!')
    const { authState, setCurrentUser } = useContext(AuthContext) as AuthContextProviderAttr
    const truthyFilter = Boolean as any as <T>(x: T | false | undefined | null | "" | 0) => x is T;

    const links = [
        !authState?.email && { label: 'Sign Up', href: '/auth/signup' },
        !authState?.email && { label: 'Sign In', href: '/auth/signin' },
        authState?.email && { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(truthyFilter)
        .map(({ label, href }) => (
            <li key={label}> <Link href={href}>{label}</Link> </li>
        ))

    useEffect(() => {
        console.log(authState?.email)
    }, [authState])

    return (
        <nav className={styles.navbar}>
            <Link href={'/'}> GitTix </Link>
            <div>
                <ul>
                    {links}
                </ul>
            </div>

        </nav>
    )
}

export default Header