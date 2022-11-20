import { View, Text } from 'react-native';
import { styles } from './styles';

export function SelectUsageTime() {
    return (
        <View style={styles.container}>
            <Text>Selecione tempo de uso da ecobike</Text>
        </View>
    );
}