import { useEffect, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
    Login,
    Home, 
    SelectLocation, 
    SelectEcoPoint, 
    SelectUsageTime,
    DetailEcoPoint,
    RouteToEcoPoint
} from '../screens';
import { Loading, Logotipo, ExitButton } from '../components';
import { THEME } from '../theme';

import { AuthContext } from '../context/auth.provider';
import { AppProvider } from '../context/app.provider';

import { supabase } from '../../infra/database/supabase/supabase.database';
import { AuthRepository } from '../../infra/repositories/supabase/auth.repository';
import { AuthController } from '../../controllers/auth.controller';


export function Routes() {
    const authRepository = AuthRepository.getInstance(supabase);
    const authController = AuthController.getInstance(authRepository);

    const { Navigator, Screen } = createNativeStackNavigator();
    const [auth, setAuth] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function logout() {
        try {
            setIsLoading(true);

            const { success, errorMessage } = await authController.sigOut();
            
            if (!success) {
                console.error(errorMessage);
                return;
            }
            
            setAuth({ session: null });
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function handleExitButton() {
        Alert.alert(
            'Logout', 
            'Você deseja mesmo fazer logout da aplicação ?', [
            {
                text: 'Não',
                style: 'cancel',
            },
            { 
                text: 'Sim',
                onPress: () => logout()
            },
        ])
    }

    useEffect(() => {
        (async() => {
            try {
                setIsLoading(true);

                const { session, errorMessage, success } = await authController.session();

                if (!success) {
                    console.error(errorMessage);
                    return;
                }

                setAuth({
                    ...auth,
                    session
                });
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <AppProvider>
            <NavigationContainer>
                <Navigator
                    screenOptions={{
                        headerTitleAlign: 'center',
                        headerTintColor: THEME.COLORS.WHITE,
                        headerTitleStyle: {
                            fontSize: THEME.FONT_SIZE.SM,
                            fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
                        },
                        headerStyle: {
                            backgroundColor: THEME.COLORS.PRIMARY,
                        },
                        headerRight: () => <ExitButton onPress={handleExitButton} />,
                    }}
                >
                    {auth.session === null ? (
                        <Screen
                            options={{
                                headerTitle: () => <Logotipo />,
                                headerStyle: {
                                    backgroundColor: THEME.COLORS.BACKGROUND,
                                },
                                headerRight: () => <></>
                            }}
                            name='Login'
                            component={Login} 
                        />
                    ) : (
                        <>
                            <Screen
                                options={{
                                    headerTitle: () => <Logotipo />,
                                    headerStyle: {
                                        backgroundColor: THEME.COLORS.BACKGROUND,
                                    },
                                    headerRight: () => (
                                        <ExitButton 
                                            onPress={handleExitButton} 
                                            color={THEME.COLORS.PRIMARY} 
                                        />
                                    ),
                                }}
                                name='Home'
                                component={Home} 
                            />
                        
                            <Screen 
                                name='SelectLocation'
                                component={SelectLocation}
                                options={{ title: 'Selecionar localização' }}
                            />
        
                            <Screen 
                                name='SelectUsageTime'
                                component={SelectUsageTime}
                                options={{ title: 'Informar tempo de uso' }}
                            />
        
                            <Screen 
                                name='SelectEcoPoint'
                                component={SelectEcoPoint}
                                options={{ title: 'Selecionar ecopoint' }}
                            />
        
                            <Screen 
                                name='DetailEcoPoint'
                                component={DetailEcoPoint}
                                options={{ title: 'Ecopoint' }}
                            />
        
                            <Screen 
                                name='RouteToEcoPoint'
                                component={RouteToEcoPoint}
                                options={{ title: 'Ecopoint' }}
                            />
                        </>
                    )}
                </Navigator>
            </NavigationContainer>
        </AppProvider>
    )
}