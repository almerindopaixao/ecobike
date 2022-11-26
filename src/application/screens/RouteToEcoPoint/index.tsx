import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { 
    useContext, 
    useEffect, 
    useState
} from 'react';
import { View, Text, Alert } from "react-native";
import MapView, { 
    Marker, 
    Polyline,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import { MapGraph, GeographicPoint } from 'map-graph';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { EcoPointMarker, Loading } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { AuthContext } from '../../context/auth.provider';
import { formateDistance } from '../../utils';

import { supabase } from '../../../infra/database/supabase/supabase.database';
import { EcoBikeRepository } from '../../../infra/repositories/supabase/ecobike.repository';
import { EcoBikeController } from '../../../controllers/ecobike.controller';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function RouteToEcoPoint() {
    const mapGraph = MapGraph.getInstance();
    const ecoBikeRepository = EcoBikeRepository.getInstance(supabase);
    const ecoBikeController = EcoBikeController.getInstance(ecoBikeRepository);

    const [auth] = useContext(AuthContext);
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
        distance: number;
        routeCoordinates: GeographicPoint[];
    }>({
        latitude: 0,
        longitude: 0,
        distance: 0,
        routeCoordinates: []
    });
    const [goalEcoPoint, setGoalEcoPoint] = useState({
        latitude: 0,
        longitude: 0,
        name: '',
        image: '',
        tempoPrevisto: 0,
        ecoBikeNumSerie: ''
    })

    function handleUserLocationChange(userPoint: GeographicPoint, goalPoint: GeographicPoint) {     
        const route = createRoute(userPoint, goalPoint);

        if (!route) {
            Alert.alert(
                'Rota não encontrada',
                'Não foi possível encontrar uma rota para o EcoPoint de destino.'
            )
            return;
        }

        setUserLocation({
            ...userPoint.toCordinates(),
            distance: route.distance,
            routeCoordinates: route.path
        });
    }

    function createRoute(startPoint: GeographicPoint, goalPoint: GeographicPoint) {
        const neighborStartPoint = mapGraph.getNextVertex(startPoint);
        const neighborGoalPoint = mapGraph.getNextVertex(goalPoint);
        return mapGraph.aStarSearch(neighborStartPoint, neighborGoalPoint);
    }


    useEffect(() => {
        let subscription: Location.LocationSubscription;

        (async () => {
            try {
                // Pegar EcoBike reservada do usuário
                const userId = auth.session?.user.id as string
                const response =  await ecoBikeController.getReservedEcoBike(userId);

                if (!response) return;

                const ecoPoint = response.ecoBike.ecoPoint;

                setGoalEcoPoint({
                    ...ecoPoint,
                    tempoPrevisto: response.tempoPrevisto,
                    ecoBikeNumSerie: response.ecoBike.numSerie
                });

                // Listner para quando o usuário mover-se pelo mapa
                subscription = await Location.watchPositionAsync(
                    { 
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 2

                    },
                    (location) => {
                        const userPoint = new GeographicPoint({ 
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        });

                        const goalPoint = new GeographicPoint({ 
                            latitude: ecoPoint.latitude,
                            longitude: ecoPoint.longitude 
                        });

                        handleUserLocationChange(userPoint, goalPoint);
                    }
                );
            } catch (err) {
               console.warn(err);
            }
        })();

        return () => {
            subscription.remove();
        }
    }, []);

    if (!userLocation.routeCoordinates.length) return <Loading />;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: LAT_DELTA,
                    longitudeDelta: LNG_DELTA
                }}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: LAT_DELTA,
                    longitudeDelta: LNG_DELTA
                }}
            >
                <Marker
                    coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    }}
                >
                    <FontAwesome 
                        name='street-view'
                        color={THEME.COLORS.SECONDARY}
                        size={35}
                    />
                </Marker>

                <Marker
                    coordinate={{
                        latitude: goalEcoPoint.latitude, 
                        longitude: goalEcoPoint.longitude
                    }}
                >
                    <FontAwesome 
                        name='map-marker'
                        color={THEME.COLORS.SECONDARY}
                        size={35}
                    />
                </Marker>

                <Polyline 
                    strokeWidth={5}
                    lineDashPattern={[0]}
                    strokeColor={THEME.COLORS.GREY}
                    coordinates={[
                        { latitude: userLocation.latitude, longitude: userLocation.longitude },
                        userLocation.routeCoordinates[0]?.toCordinates()
                    ]}
                />

                <Polyline 
                    strokeWidth={5}
                    lineDashPattern={[0]}
                    strokeColor={THEME.COLORS.GREY}
                    coordinates={[
                        userLocation.routeCoordinates[userLocation.routeCoordinates?.length - 1].toCordinates(),
                        { latitude: goalEcoPoint.latitude, longitude: goalEcoPoint.longitude },
                    ]}
                />

                <Polyline 
                    strokeWidth={5}
                    lineDashPattern={[0]}
                    strokeColor={THEME.COLORS.PRIMARY}
                    coordinates={userLocation.routeCoordinates.map((point) => point.toCordinates())}
                />
            </MapView>
            <View style={styles.card}>
                <Text style={styles.titleCard}>Sua ecobike foi reservada</Text>
                <Text style={styles.textTimeCard}>{formateDistance(userLocation.distance)}</Text>
            </View>
        </View>
    );
}