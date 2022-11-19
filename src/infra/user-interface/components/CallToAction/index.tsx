import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';
import { THEME } from '../../theme';

interface CallToActionProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
}

export function CallToAction({ title, subtitle, ...rest }: CallToActionProps) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons 
          name='chevron-right' 
          size={60} 
          color={THEME.COLORS.PRIMARY} 
        />
    </TouchableOpacity>
  );
}