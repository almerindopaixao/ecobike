
import { View, Text, Image } from 'react-native';

import { styles } from './styles';
import logoImageApp from '../../assets/images/logo.png';
import { THEME } from '../../theme';

export function Logotipo() {
  return (
    <View style={styles.container}>
        <Image 
          source={logoImageApp} 
          resizeMode='contain' 
          style={styles.image}
        />
        <View style={styles.content}>
            <Text style={{...styles.text, color: THEME.COLORS.PRIMARY}}>ECO </Text>
            <Text style={{...styles.text, color: THEME.COLORS.TEXT}}>BIKE</Text>
        </View>
    </View>
  );
}