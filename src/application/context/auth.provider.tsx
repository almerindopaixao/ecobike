import { Session } from '@supabase/supabase-js';
import { useState, createContext } from 'react';

export interface IAuthContext {
    session: Session | null,
}

interface AuthProviderProps {
    children: JSX.Element;
}

export const AuthContext = createContext<[IAuthContext, React.Dispatch<React.SetStateAction<IAuthContext>>]>([
    {} as IAuthContext,
    () => {}
]);

export function AuthProvider({ children }: AuthProviderProps) {
    const userContext: IAuthContext = {
        session: null
    }

    const [auth, setAuth] = useState<IAuthContext>(userContext)

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}