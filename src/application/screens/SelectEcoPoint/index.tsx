import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '../../context/user.provider';
import { EcoPointMarker, LocationMarker, Loading } from '../../components';
import { styles } from './styles';

import { supabase } from '../../../infra/database/supabase/supabase.database';
import { 
    EcoPointRepository, 
    ListEcoPoints 
} from '../../../infra/repositories/supabase/ecopoint.repository';
import { EcoPointController } from '../../../controllers/ecopoint.controller';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function SelectEcoPoint() {
    const ecoPointRepository = EcoPointRepository.getInstance(supabase);
    const ecoPointController = EcoPointController.getInstance(ecoPointRepository);

    const [user, setUser] = useContext(UserContext);
    const [ecopoints, setEcopoints] = useState<ListEcoPoints>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();

    function handleGoDetailEcoPoint(ecopointId: string) {
        navigation.navigate('DetailEcoPoint', { ecopointId });
    }

    useEffect(() => {
        (async () => {
            try {
              setLoading(true);
              const result = await ecoPointController.listAllEcoPoints();
              setEcopoints(result);
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? <Loading bottom={0} /> : (<MapView
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
                        <LocationMarker 
                            size={30}
                        />
                        <Text style={styles.mapMarkerTitle}>Você está aqui</Text>
                    </View>
                </Marker>

                {ecopoints.map((ecopoint) => (
                    <Marker
                        key={ecopoint.id}
                        onPress={() => handleGoDetailEcoPoint(ecopoint.id)}
                        style={styles.mapMarker}
                        coordinate={{
                            latitude: ecopoint.latitude, 
                            longitude: ecopoint.longitude
                        }}
                    >
                        <EcoPointMarker 
                            name={ecopoint.nome}
                            image_url={ecopoint.imagem}
                        />
                    </Marker>
                ))}
            </MapView>)}
        </View>
    );
}