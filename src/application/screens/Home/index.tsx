import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Linking, 
  Platform, 
  AppState, 
  AppStateStatus, 
  NativeEventSubscription 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import { MaterialIcons } from '@expo/vector-icons';

import { CallToAction, EnableLocationModal } from '../../components';

import { styles } from './styles';
import { THEME } from '../../theme';

export function Home() {
  const appState = useRef(AppState.currentState);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  function handleReserveEcobike() {
    navigation.navigate('SelectLocation');
  }

  async function openSettings() {
    setIsLocationModalVisible(false);

    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
      return;
    }
    
    await startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
  }

  async function verifyIfLocationServicesIsReady() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) setIsLocationModalVisible(true);
    } catch (err) {
      console.warn(err);
      const { locationServicesEnabled } = await Location.getProviderStatusAsync();
      if (!locationServicesEnabled) setIsLocationModalVisible(true);
    }
  }

  async function handleAppStateChange(nextAppState: AppStateStatus) {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') await verifyIfLocationServicesIsReady();
    appState.current = nextAppState;
  }

  useEffect(() => {
    console.log('Renderizou Home');
    let subscription: NativeEventSubscription;

    const checkLocation = async () => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (granted) return;

      setIsLocationModalVisible(true);
      subscription = AppState.addEventListener('change', handleAppStateChange);
    }

    checkLocation()
      .catch(console.error);

    return () => {
      if (subscription) subscription.remove();
    }
  }, []);

  return (
    <>
      <EnableLocationModal
        visible={isLocationModalVisible} 
        onPressActive={openSettings} 
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <MaterialIcons 
            name='directions-bike' 
            size={58}
            color={THEME.COLORS.WHITE}
          />
          <Text style={styles.title}>Seu marketplace de aluguel de bicicletas</Text>
        </View>

        <CallToAction 
          title='Reservar uma ecobike?'
          subtitle='Encontre um ecopoint mais próximo de você'
          onPress={handleReserveEcobike}
        />
      </SafeAreaView>
    </>
  );
}