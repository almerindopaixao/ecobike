import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { styles } from './styles';
import { DetailEcoPointParams } from '../../@types/navigation';

export function DetailEcoPoint() {
    const route = useRoute();
    const params = route.params as DetailEcoPointParams

    return (
        <View style={styles.container}>
            <Text>Detalhes do EcoPoint {params.ecopointId}</Text>
        </View>
    );
}