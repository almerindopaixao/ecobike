import { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { AppButton } from '../../components';

import { DetailEcoPointParams } from '../../@types/navigation';
import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { UserContext } from '../../context/user.provider';

import { calculateFaturamento } from '../../utils';

export function DetailEcoPoint() {
    const [user] = useContext(UserContext);
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

    function handleReserveButton() {
        navigation.navigate('RouteToEcoPoint');
    }

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
                    R$ {calculateFaturamento(user.time_usage)}
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