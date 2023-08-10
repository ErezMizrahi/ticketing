import React, { ReactNode } from 'react';
import styles from './auth.module.css';

const AuthLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.authContainer}>{children}</div>
  )
}

export default AuthLayout