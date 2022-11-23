import { useState, createContext } from 'react';

export interface IUserContext {
    time_usage: number;
    start_point: {
        latitude: number;
        longitude: number;
    };
    ecopoint_goal: {
        latitude: number;
        longitude: number;
    };
}

interface UserProviderProps {
    children: JSX.Element;
}

export const UserContext = createContext<[IUserContext, React.Dispatch<React.SetStateAction<IUserContext>>]>([
    {} as IUserContext,
    () => {}
]);

export function UserProvider({ children }: UserProviderProps) {
    const userContext: IUserContext = {
        time_usage: 0,
        start_point: {
            latitude: 0,
            longitude: 0
        },
        ecopoint_goal: {
            latitude: 0,
            longitude: 0
        }
    }

    const [user, setUser] = useState<IUserContext>(userContext)

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}