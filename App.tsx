import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { 
  useFonts, 
  Lexend_700Bold,
  Lexend_600SemiBold, 
  Lexend_400Regular
} from '@expo-google-fonts/lexend';

import {
  Nunito_400Regular,
  Nunito_800ExtraBold,
  Nunito_600SemiBold,
  Nunito_500Medium
} from '@expo-google-fonts/nunito';

import { Routes } from './src/application/routes';
import { Loading } from './src/application/components/Loading';

// Mantem a tela inicial visível enquanto o usuário confirma sua localização
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
    Lexend_600SemiBold,
    Lexend_400Regular,
    Nunito_800ExtraBold,
    Nunito_500Medium,
    Nunito_400Regular,
    Nunito_600SemiBold
  });

  async function requestLocationPermissionFromDevice() {
    try {
      await Location.requestForegroundPermissionsAsync();
    } catch (err) {
      console.warn(err);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    (async () => {
      await requestLocationPermissionFromDevice();
    })();
  }, []);

  if (!appIsReady) return null;

  return (
    <>
      <StatusBar  
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent
      />
      {fontsLoaded ? <Routes /> : <Loading/>}
    </>
  );
}
