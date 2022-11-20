import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
    Home, 
    SelectLocation, 
    SelectEcoPoint, 
    SelectUsageTime,
    DetailEcoPoint
} from '../screens';
import { UserProvider } from '../context/user.provider';
import { Logotipo } from '../components';
import { THEME } from '../theme';

export function Routes() {
    const { Navigator, Screen } = createNativeStackNavigator();

    return (
        <UserProvider>
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
                        }
                    }}
                >
                    <Screen
                        options={{
                            headerTitle: () => <Logotipo />,
                            headerStyle: {
                                backgroundColor: THEME.COLORS.BACKGROUND,
                            }
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
                        options={{ title: 'Detalhes do ecopoint' }}
                    />
                </Navigator>
            </NavigationContainer>
        </UserProvider>
    )
}