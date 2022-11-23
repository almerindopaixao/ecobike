import Constants from 'expo-constants';
import { useContext } from 'react';
import { View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { UserContext } from '../../context/user.provider';

import { styles } from './styles';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function RouteToEcoPoint() {
    const [user] = useContext(UserContext);

    const region: Region = {
        latitude: user.start_point.latitude,
        longitude: user.start_point.longitude,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA
    };

    return (
        <View style={styles.container}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={region}
              initialRegion={region}
            >
            </MapView>
            <View style={styles.card}>
                <Text style={styles.titleCard}>Sua ecobike foi reservada</Text>
                <Text style={styles.textTimeCard}>05 min</Text>
                <Text style={styles.textDistanceCard}>0,8 km</Text>
            </View>
        </View>
    )
}