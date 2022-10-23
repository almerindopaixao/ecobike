import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, SearchEcoPoint } from '../screens';
import { Logotipo } from '../components';
import { THEME } from '../theme';

export function Routes() {
    const { Navigator, Screen } = createNativeStackNavigator();

    return (
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
                    name='SearchEcoPoint'
                    component={SearchEcoPoint}
                    options={{ title: 'Encontre um ecopoint' }}
                />
            </Navigator>
        </NavigationContainer>
    )
}