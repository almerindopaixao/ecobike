import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';
import { THEME } from '../../theme';
import { IconProps } from 'phosphor-react';

interface CallToActionProps extends TouchableOpacityProps {
  title: string;
  icon: 'receipt-long' | 'directions-bike';
}

export function CallToAction({ title, icon, ...rest }: CallToActionProps) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
        <MaterialIcons
          name={icon}
          size={60} 
          color={THEME.COLORS.PRIMARY} 
        />
        <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}