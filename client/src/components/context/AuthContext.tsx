'use client';
import { createContext, useState } from 'react';
export interface AuthContextAttr {
    id: string,
    email: string
}
export interface AuthContextProviderAttr {
    authState: AuthContextAttr,
    setCurrentUser: (state: any) => void
}


export const AuthContext = createContext<AuthContextProviderAttr | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authState, setAuthState] = useState<any>({ id: "", email: "" });

    const setCurrentUser = (currentUser: { id: string, email: string }) => {
        console.log('set context user!')
        setAuthState(
            currentUser
        );
    }
    return (
        <AuthContext.Provider value={{ authState, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}