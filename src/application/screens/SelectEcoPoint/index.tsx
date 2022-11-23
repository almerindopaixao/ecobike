import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '../../context/app.provider';
import { EcoPointMarker, LocationMarker, Loading } from '../../components';
import { styles } from './styles';

import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { supabase } from '../../../infra/database/supabase/supabase.database';
import { EcoPointRepository } from '../../../infra/repositories/supabase/ecopoint.repository';
import { EcoPointController } from '../../../controllers/ecopoint.controller';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function SelectEcoPoint() {
    const ecoPointRepository = EcoPointRepository.getInstance(supabase);
    const ecoPointController = EcoPointController.getInstance(ecoPointRepository);

    const [app] = useContext(AppContext);
    const [ecopoints, setEcopoints] = useState<EcoPointDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();

    function handleGoDetailEcoPoint(ecopoint: EcoPointDto) {
        navigation.navigate('DetailEcoPoint', { ecopoint });
    }

    useEffect(() => {
        (async () => {
            try {
              setLoading(true);
              const result = await ecoPointController.listAllEcoPointsInRegion();
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
                    latitude: app.start_point.latitude,
                    longitude: app.start_point.longitude,
                    latitudeDelta: LAT_DELTA + 0.005,
                    longitudeDelta: LNG_DELTA + 0.005
                }}
            >
                <Marker
                    coordinate={{
                        latitude: app.start_point.latitude,
                        longitude: app.start_point.longitude,
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
                        onPress={() => handleGoDetailEcoPoint(ecopoint)}
                        style={styles.mapMarker}
                        coordinate={{
                            latitude: ecopoint.latitude, 
                            longitude: ecopoint.longitude
                        }}
                    >
                        <EcoPointMarker 
                            name={ecopoint.nome}
                            image_url={ecopoint.imagemSm}
                        />
                    </Marker>
                ))}
            </MapView>)}
        </View>
    );
}