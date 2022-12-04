import { View, ActivityIndicator } from 'react-native';

import { styles } from './styles';
import { THEME } from '../../theme';

export function Loading({ bottom = 0 }: { bottom?: number}) {
  return (
    <View style={{...styles.container, bottom }}>
        <ActivityIndicator color={THEME.COLORS.PRIMARY} size='large' />
    </View>
  );
}