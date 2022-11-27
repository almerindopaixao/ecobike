import { useContext, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { AppButton, Loading } from '../../components';

import { DetailEcoPointParams } from '../../@types/navigation';
import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { AppContext } from '../../context/app.provider';
import { AuthContext } from '../../context/auth.provider';

import { calculateFaturamento } from '../../utils';
import { supabase } from '../../../infra/database/supabase/supabase.database';
import { EcoBikeRepository } from '../../../infra/repositories/supabase/ecobike.repository';
import { AuthRepository } from '../../../infra/repositories/supabase/auth.repository';
import { EcoBikeController } from '../../../controllers/ecobike.controller';
import { AuthController } from '../../../controllers/auth.controller';


export function DetailEcoPoint() {
    const authRepository = AuthRepository.getInstance(supabase);
    const ecoBikeRepository = EcoBikeRepository.getInstance(supabase);

    const authController = AuthController.getInstance(authRepository);
    const ecoBikeController = EcoBikeController.getInstance(ecoBikeRepository);

    const [app] = useContext(AppContext);
    const [auth, setAuth] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const route = useRoute();
    const navigation = useNavigation();

    const params = route.params as DetailEcoPointParams;

    function createAddresFromEcopoint(ecopoint: EcoPointDto) {
        const first_line = `${ecopoint.cidade}, ${ecopoint.estado}`;
        const middle_line = `${ecopoint.logradouro}, ${ecopoint.bairro}`;
        const last_line = ecopoint.numero ? `Nº ${ecopoint.numero}` : '';

        return `${first_line}\n${middle_line}\n${last_line}`;
    }

    function handleCancelButton() {
        navigation.goBack();
    }

    async function handleReserveButton() {
        try {
            setIsLoading(true);
            
            const ecoPointId = params.ecopoint.id;
            const userId = auth.session?.user.id as string;
            const timeUsage = app.time_usage;
    
            const result = await ecoBikeController.reserveEcoBike(ecoPointId, userId, timeUsage);
    
            if (!result.success) {
                Alert.alert(
                    result.error?.title as string, 
                    result.error?.message
                )
                return;
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

    if (isLoading) return <Loading />

    return (
        <View style={styles.container}>
            <View style={styles.sectionContainer}>
            <Image 
                style={styles.imageCover}
                source={{
                    uri: params.ecopoint.imagemMd,
                }} 
            />
                <Text style={styles.mainTitle}>{params.ecopoint.nome}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Endereço</Text>
                <Text style={styles.addressText}>
                    {createAddresFromEcopoint(params.ecopoint)}
                </Text>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Valor Estimado</Text>
                <Text style={styles.valueText}>
                    R$ {calculateFaturamento(app.time_usage)}
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton 
                    onPress={handleReserveButton}
                    type='primary' 
                    text='Reservar'
                />
                <AppButton 
                    onPress={handleCancelButton}
                    type='secondary' 
                    text='Cancelar'
                    marginTop={16}
                />
            </View>
        </View>
    );
}