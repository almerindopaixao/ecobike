import { 
  useEffect, 
  useState, 
  useRef,
  useContext
} from 'react';
import { 
  ScrollView,
  View, 
  Text, 
  Linking, 
  Platform, 
  AppState, 
  AppStateStatus, 
  NativeEventSubscription, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../../context/auth.provider';
import { CallToAction, EnableLocationModal } from '../../components';

import { styles } from './styles';
import { THEME } from '../../theme';
import { EcobikeUserStatus } from '../../../constants/app.contants';

export function Home() {
  const appState = useRef(AppState.currentState);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const [auth] = useContext(AuthContext);

  function handleGoReserveEcoBike() {
    navigation.navigate('SelectLocation');
  }

  function handleGoRefundEcoBike() {
    navigation.navigate('SelectEcoPoint');
  }

  function handleGoRecords() {
    navigation.navigate('Records');
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


        <ScrollView 
          horizontal={true} 
          style={styles.actions}
        > 
          <CallToAction 
            title={
              auth.session?.user.ecobike?.status === EcobikeUserStatus.EM_USO ? 
              'Devolver EcoBike' : 
              'Reservar EcoBike'
            }
            icon='directions-bike'
            onPress={ 
              auth.session?.user.ecobike?.status === EcobikeUserStatus.EM_USO ?         
              handleGoRefundEcoBike : 
              handleGoReserveEcoBike
            }
          />

          <CallToAction 
            title='Histórico de Corridas'
            icon='receipt-long'
            onPress={handleGoRecords}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}