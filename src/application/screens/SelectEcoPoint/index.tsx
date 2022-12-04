import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '../../context/app.provider';
import { AuthContext } from '../../context/auth.provider';
import { EcoPointMarker, LocationMarker, Loading } from '../../components';
import { styles } from './styles';

import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { EcobikeUserStatus } from '../../../constants/app.contants';
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
    const [auth] = useContext(AuthContext);

    const [ecopoints, setEcopoints] = useState<EcoPointDto[]>([]);
    const [coords, setCoords] = useState({
        latitude: app.start_point.latitude,
        longitude: app.start_point.longitude
    });
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();


    const isRefund = 
        auth.session?.user.ecobike?.status === EcobikeUserStatus.EM_USO;

    function handleGoDetailEcoPoint(ecopoint: EcoPointDto) {
        navigation.navigate('DetailEcoPoint', { ecopoint });
    }

    async function setCurrentCoords() {
        if (isRefund) {
            const { coords } = await Location.getCurrentPositionAsync();
            setCoords({
                latitude: coords.latitude,
                longitude: coords.longitude
            })

        }
    }

    function ecopointIsAccessible(ecopoint: EcoPointDto) {
        if (isRefund) return !!ecopoint.slotsDisponiveis;
        return !!ecopoint.ecobikesDisponiveis;
    }

    useEffect(() => {
        // Atualização automática de ecopoints na tela
        const interval = setInterval(async () => {
            const result = await ecoPointController.listAllEcoPointsInRegion();
            setEcopoints(result);
        }, 5000); 

        (async () => {
            try {
              setLoading(true);
              await setCurrentCoords();
              
              const result = await ecoPointController.listAllEcoPointsInRegion();
              setEcopoints(result);
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
        })();

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            {loading ? <Loading bottom={0} /> : (<MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
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
                        onPress={() => ecopointIsAccessible(ecopoint) && handleGoDetailEcoPoint(ecopoint)}
                        style={styles.mapMarker}
                        coordinate={{
                            latitude: ecopoint.latitude, 
                            longitude: ecopoint.longitude
                        }}
                    >
                        <EcoPointMarker 
                            disabled={!ecopointIsAccessible(ecopoint)}
                            name={ecopoint.nome}
                            image_url={ecopoint.imagemSm}
                        />
                    </Marker>
                ))}
            </MapView>)}
        </View>
    );
}