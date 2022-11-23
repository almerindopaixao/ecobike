import { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaskInput from 'react-native-mask-input';

import { AppContext } from '../../context/app.provider';
import { AppButton } from '../../components';
import { styles } from './styles';

export function SelectUsageTime() {
    const initialErrorInput = {
        hasError: false,
        msg: ''
    }

    const [errorInput, setErrorInput] = useState<{
        hasError: boolean,
        msg: string;
    }>(initialErrorInput);
    const [time, setTime] = useState<string>('');

    const startsWithTwo = time[0] === '2'
    const mask = [
        /[0-2]/,
        startsWithTwo ? /[0-3]/ : /[0-9]/,
        ':',
        /[0-5]/,
        /[0-9]/,
    ]

    const [app, setApp] = useContext(AppContext);
    const navigation = useNavigation();

    function resetErrors() {
        setErrorInput({
            hasError: false,
            msg: ''
        });
    }

    function handleGoSelectEcoPoint() {
        // Verificar erros
        if (!time.length) {
            setErrorInput({
                hasError: true,
                msg: 'Campo obrigatório'
            });
            return;
        }

        const [hours = '0', minutes = '0'] = time.split(':');

        const timeInMinutes = (parseInt(hours) * 60) + parseInt(minutes);

        if (!timeInMinutes) {
            setErrorInput({
                hasError: true,
                msg: 'Valor inválido'
            });
            return;
        }

        resetErrors();

        setApp({
            ...app,
            time_usage: timeInMinutes
        });

        navigation.navigate('SelectEcoPoint');
    }

    function handleTimeChange(masked: string, unmasked: string) {
        setTime(masked);
    }

    return (
        <View style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Por quanto tempo você vai utilizar a ecobike ?
                </Text>
                <MaskInput 
                    style={ !errorInput.hasError ? styles.input : { ...styles.input, ...styles.inputError }}
                    value={time}
                    placeholder='00:00' 
                    onChangeText={handleTimeChange}
                    keyboardType='numeric'
                    mask={mask}
                />

                {errorInput.hasError && <Text style={styles.msgError} >{errorInput.msg}</Text>}
            </View>

            <AppButton 
                text='Próximo'
                type='primary'
                onPress={handleGoSelectEcoPoint}
            />
        </View>
    );
}