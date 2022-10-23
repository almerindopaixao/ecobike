import { StatusBar } from 'react-native';
import { 
  useFonts, 
  Lexend_700Bold,
  Lexend_600SemiBold, 
  Lexend_400Regular
} from '@expo-google-fonts/lexend';

import {
  Nunito_400Regular,
  Nunito_800ExtraBold
} from '@expo-google-fonts/nunito';

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Lexend_700Bold,
    Lexend_600SemiBold,
    Lexend_400Regular,
    Nunito_800ExtraBold,
    Nunito_400Regular,
  });

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
