import { useContext } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { UserContext } from '../../context/user.provider';
import { EcoPointMarker, LocationMarker } from '../../components';
import { styles } from './styles';

import { LAT_DELTA, LNG_DELTA } from '../../../config/constants';


export function SelectEcoPoint() {
    const [user, setUser] = useContext(UserContext);


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: user.start_point.latitude,
                    longitude: user.start_point.longitude,
                    latitudeDelta: LAT_DELTA + 0.005,
                    longitudeDelta: LNG_DELTA + 0.005
                }}
            >
                <Marker
                    coordinate={{
                        latitude: user.start_point.latitude,
                        longitude: user.start_point.longitude,
                    }}
                >
                    <View style={styles.mapMarkerContainer}>
                        <LocationMarker size={30} />
                        <Text style={styles.mapMarkerTitle}>Você está aqui</Text>
                    </View>
                </Marker>
                
                <Marker
                    style={styles.mapMarker}
                    coordinate={{
                        latitude: -12.148675842104419, 
                        longitude: -38.414977196482816
                    }}
                >
                    <EcoPointMarker name='Só Bike' />
                </Marker>

                <Marker
                    style={styles.mapMarker}
                    coordinate={{
                        latitude: -12.149850558393751, 
                        longitude: -38.41227352992463
                    }}
                >
                    <EcoPointMarker name='rapidão' />
                </Marker>
            </MapView>
        </View>
    );
}