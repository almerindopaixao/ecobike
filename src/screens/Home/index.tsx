import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { CallToAction } from '../../components';

import { styles } from './styles';
import { THEME } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const navigation = useNavigation();

  function handleReserveEcobike() {
    navigation.navigate('SearchEcoPoint');
  }

  return (
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
  );
}