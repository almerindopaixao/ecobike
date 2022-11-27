import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { 
    useContext, 
    useEffect, 
    useState,
    useRef
} from 'react';
import { View, Text, Alert, TouchableOpacity } from "react-native";
import MapView, { 
    Marker, 
    Polyline,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import { MapGraph, GeographicPoint } from 'map-graph';
import { FontAwesome } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';

import { Loading, ConfirmModal } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { AuthContext } from '../../context/auth.provider';
import { formateDistance } from '../../utils';

import { supabase } from '../../../infra/database/supabase/supabase.database';
import { EcoBikeRepository } from '../../../infra/repositories/supabase/ecobike.repository';
import { AuthRepository } from '../../../infra/repositories/supabase/auth.repository';
import { EcoBikeController } from '../../../controllers/ecobike.controller';
import { AuthController } from '../../../controllers/auth.controller';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function RouteToEcoPoint() {
    const mapGraph = MapGraph.getInstance();

    const authRepository = AuthRepository.getInstance(supabase);
    const ecoBikeRepository = EcoBikeRepository.getInstance(supabase);

    const authController = AuthController.getInstance(authRepository);
    const ecoBikeController = EcoBikeController.getInstance(ecoBikeRepository);

    const [auth, setAuth] = useContext(AuthContext);
    const modalRef = useRef<Modalize>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    });

    function openWithdrawModal() {
        modalRef.current?.open();
    }

    function closeWithdrawModal() {
        modalRef.current?.close();
    }

    function handleUserLocationChange(
        userPoint: GeographicPoint, 
        goalPoint: GeographicPoint
    ) {     
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

        // Abrir modal de confirmação de retirada
        if (route.distance > 0.002) {
            openWithdrawModal();
            return;
        }

        // Fechar modal caso o usuário esteja longe do local de retirada
        closeWithdrawModal();
    }

    async function cancelReserva() {
        try {
            setIsLoading(true)

            const userId = auth.session?.user.id as string;
            const result = await ecoBikeController.cancelEcoBikeReserve(userId);
     
            if (!result?.success) {
                Alert.alert(
                    result?.error?.title as string,
                    result?.error?.message
                );
            }
    
            const { session } = await authController.session();

            
            if (session) {
                closeWithdrawModal();

                setAuth({
                    ...auth,
                    session
                })   
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePressWithdrawEcoBikeButton() {
        try {
            setIsLoading(true);

            const userId = auth.session?.user.id as string;
            const ecobikeId = auth.session?.user.ecobike?.id as string; 
    
            const result = await ecoBikeController.withdrawEcoBike(userId, ecobikeId);
    
            if (!result.success) {
                Alert.alert(
                    result.error?.title as string,
                    result.error?.message
                )
            }

            const { session } = await authController.session();
    
            if (session) {
                setAuth({
                    ...auth,
                    session
                })   
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    function handlePressCancelWithdrawEcoBikeButton() {
        Alert.alert(
            'Você deseja mesmo cancelar a reserva da ecobike ?',
            'Esta é uma ação irreversível, você será redirecionado para a tela inicial',[
                {
                    text: 'Não',
                    style: 'cancel',
                },
                { 
                    text: 'Sim',
                    onPress: () => cancelReserva()
                },
            ]
        )
    }

    function createRoute(startPoint: GeographicPoint, goalPoint: GeographicPoint) {
        const neighborStartPoint = mapGraph.getNextVertex(startPoint);
        const neighborGoalPoint = mapGraph.getNextVertex(goalPoint);

        // Clear cache Edges
        mapGraph.edges.forEach((edges) => {
            edges.start.distance = 0;
            edges.start.actualDistance = 0;

            edges.end.distance = 0;
            edges.end.actualDistance = 0;
        });

        return mapGraph.aStarSearch(neighborStartPoint, neighborGoalPoint);
    }

    useEffect(() => {
        let subscription: Location.LocationSubscription;

        (async () => {
            try {
                // Pegar EcoBike reservada do usuário
                const userId = auth.session?.user.id as string

                const reservedEcoBike =  await ecoBikeController.getReservedEcoBike(userId);

                if (!reservedEcoBike) return;

                const {
                    tempoPrevisto,
                    ecoBikeNumSerie,
                    ecoPointImage,
                    ecoPointLatitude,
                    ecoPointLongitude
                } = reservedEcoBike;

                setGoalEcoPoint({
                    latitude: ecoPointLatitude,
                    longitude: ecoPointLongitude,
                    image: ecoPointImage,
                    name: ecoPointImage,
                    tempoPrevisto: tempoPrevisto,
                    ecoBikeNumSerie: ecoBikeNumSerie
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
                            latitude: ecoPointLatitude,
                            longitude: ecoPointLongitude
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

    if (!userLocation.routeCoordinates.length || isLoading) return <Loading />;

    return (
        <>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
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
                    <View style={styles.content}>
                        <Text style={styles.titleCard}>Sua ecobike foi reservada</Text>
                        <Text style={styles.textTimeCard}>{formateDistance(userLocation.distance)}</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={handlePressCancelWithdrawEcoBikeButton}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ConfirmModal 
                customRef={modalRef}
                onPressCancel={handlePressCancelWithdrawEcoBikeButton}
                onPressConfirm={handlePressWithdrawEcoBikeButton}
                numSerieEcoBike={auth.session?.user.ecobike?.numSerie as string}
                tempoPrevistoCorrida={auth.session?.user.ecobike?.tempoPrevisto as number}
            />
        </>
    );
}