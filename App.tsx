import 'react-native-url-polyfill/auto'
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { MapGraph, MapGraphLoader } from 'map-graph';

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
  Nunito_700Bold,
  Nunito_500Medium
} from '@expo-google-fonts/nunito';

import { Routes } from './src/application/routes';
import { AuthProvider } from './src/application/context/auth.provider';
import { Loading } from './src/application/components/Loading';

import JardimPetrolarMap from './src/assets/jsons/maps/jardim-petrolar.json';

// Mantem a tela inicial visível enquanto o usuário confirma sua localização
SplashScreen.preventAutoHideAsync();

export default function App() {
  const mapGraph = MapGraph.getInstance();

  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
    Lexend_600SemiBold,
    Lexend_400Regular,
    Nunito_800ExtraBold,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_500Medium,
    Nunito_400Regular,
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
      // Verificar Localização do usuário
      await requestLocationPermissionFromDevice();

      // Carregar o mapa para rotas
      MapGraphLoader.loadRoadMap(JardimPetrolarMap, mapGraph);
    })();
  }, []);

  if (!appIsReady) return null;

  return (
    <AuthProvider>
      <>
        <StatusBar  
          barStyle="dark-content" 
          backgroundColor="transparent" 
          translucent
        />
        {fontsLoaded ? <Routes /> : <Loading/>}
      </>
    </AuthProvider>
  );
}
