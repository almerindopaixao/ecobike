import moment from 'moment';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { 
    useContext, 
    useEffect, 
    useState,
    useRef,
} from 'react';
import { View, Text, Alert } from "react-native";
import MapView, { 
    Marker, 
    Polyline,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MapGraph, GeographicPoint } from 'map-graph';
import { FontAwesome } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';

import { Loading, ConfirmModal, AlertModal } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { AuthContext } from '../../context/auth.provider';
import { calculateFaturamento, formateDistance, toHoursAndMinutes } from '../../utils';

import { UserSessionDto } from '../../../dtos/user-session.dto';
import { RefundEcoBikeRoutesParams } from "../../@types/navigation";

import { supabase } from '../../../infra/database/supabase/supabase.database';
import { EcoBikeRepository } from '../../../infra/repositories/supabase/ecobike.repository';
import { AuthRepository } from '../../../infra/repositories/supabase/auth.repository';
import { EcoBikeController } from '../../../controllers/ecobike.controller';
import { AuthController } from '../../../controllers/auth.controller';
import { RaceDto } from '../../../dtos/race.dto';

const { 
    LAT_DELTA = '', 
    LNG_DELTA = '' 
  } = Constants.expoConfig?.extra || {}

export function RefundEcoBikeRoutes() {
    const mapGraph = MapGraph.getInstance();

    const ecoBikeRepository = EcoBikeRepository.getInstance(supabase);
    const authRepository = AuthRepository.getInstance(supabase);

    const ecoBikeController = EcoBikeController.getInstance(ecoBikeRepository);
    const authController = AuthController.getInstance(authRepository);

    const route = useRoute();
    const navigation = useNavigation();
    const [auth, setAuth] = useContext(AuthContext);
    const confirModalRef = useRef<Modalize>(null);
    const alertModalRef = useRef<Modalize>(null);
    const params = route.params as RefundEcoBikeRoutesParams;

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);
    const [alertModalIsOpen, setAlertModalIsOpen] = useState<boolean>(false);
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

    function openConfirmModal() {
        setConfirmModalIsOpen(true);
        confirModalRef.current?.open();
    }

    function closeConfirmModal() {
        setConfirmModalIsOpen(false);
        confirModalRef.current?.close();
    }

    function openAlertModal() {
        setAlertModalIsOpen(true);
        alertModalRef.current?.open();
    }

    async function handleUserLocationChange(
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
    }

    function handlePressConfirmRefundEcoBikeButton() {
        closeConfirmModal();
        openAlertModal();
    }

    function handlePressCancelRefundEcoBikeButton() {
        closeConfirmModal();
        navigation.navigate('Home');
    }

    async function handlePressConfirmAlertButton() {
        try {
            alertModalRef.current?.close();
            setIsLoading(true);

            const userId = auth.session?.user.id as string;
            const ecobikeId = auth.session?.user.ecobike?.id as string; 
            const ecopointId = params.ecopoint.id;

            const dataHoraInicial = auth.session?.user.ecobike?.dataHoraInicial as string;
            const dataHoraFinal = (new Date()).toISOString();

            const start = moment(dataHoraInicial.endsWith('Z') ? dataHoraInicial : `${dataHoraInicial}Z`);
            const end = moment(dataHoraFinal);
    
            const duration = moment.duration(end.diff(start)).asMinutes();
            const faturamento = calculateFaturamento(duration);

            const data: Omit<RaceDto, 'id'> = {
                faturamento: +faturamento,
                tempo: Math.ceil(duration),
                dataHoraInicial,
                dataHoraFinal,
            }

            const result = await ecoBikeController.refundEcoBike(
                userId, 
                ecobikeId,
                ecopointId,
                data
            );
    
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

            navigation.navigate('Home');
        } catch (err) {
            console.log(err);
            setAlertModalIsOpen(false);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (alertModalIsOpen) return;

        // Abrir modal de confirmação de entrega da ecobike
        if (userLocation.distance < 0.002 && !confirmModalIsOpen) {
            openConfirmModal();
            return;
        }

        // Fechar modal caso o usuário esteja longe do local de entrega
        if (userLocation.distance >= 0.002 && confirmModalIsOpen) {
            closeConfirmModal();
            return;
        }

    }, [userLocation]);

    useEffect(() => {
        let subscription: Location.LocationSubscription;

        (async () => {
            try {
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
                            latitude: params.ecopoint.latitude,
                            longitude: params.ecopoint.longitude
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

    return (
        <>
            <View style={styles.container}>
                {
                    !userLocation.routeCoordinates.length || isLoading ?
                    <Loading /> :
                    (
                        <>
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
                                        latitude: params.ecopoint.latitude, 
                                        longitude: params.ecopoint.longitude
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
                                        { latitude: params.ecopoint.latitude, longitude: params.ecopoint.longitude },
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
                                    <Text style={styles.titleCard}>Distância até o ecopoint</Text>
                                    <Text style={styles.textTimeCard}>{formateDistance(userLocation.distance)}</Text>
                                </View>
                            </View>
                        </>
                    )
                }
            </View>
            <ConfirmModal 
                customRef={confirModalRef}
                isRefund={true}
                onPressConfirm={handlePressConfirmRefundEcoBikeButton}
                onPressCancel={handlePressCancelRefundEcoBikeButton}
                session={auth.session as UserSessionDto}
            />
            <AlertModal 
                customRef={alertModalRef}
                onPressConfirm={handlePressConfirmAlertButton}
            />
        </>
    )

}