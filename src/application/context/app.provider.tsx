import { useState, createContext } from 'react';

export interface IAppContext {
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

interface AppProviderProps {
    children: JSX.Element;
}

export const AppContext = createContext<[IAppContext, React.Dispatch<React.SetStateAction<IAppContext>>]>([
    {} as IAppContext,
    () => {}
]);

export function AppProvider({ children }: AppProviderProps) {
    const appContext: IAppContext = {
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

    const [app, setApp] = useState<IAppContext>(appContext)

    return (
        <AppContext.Provider value={[app, setApp]}>
            {children}
        </AppContext.Provider>
    )
}