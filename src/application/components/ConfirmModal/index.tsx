import moment from 'moment';
import { useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { View, Text, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppButton } from '../AppButton';
import { styles } from './styles';
import { THEME } from '../../theme';

import { calculateFaturamento, toHoursAndMinutes } from '../../utils';
import { UserSessionDto } from '../../../dtos/user-session.dto';

interface ConfimModalProps {
    customRef: React.RefObject<Modalize>;
    onPressConfirm: (event: GestureResponderEvent) => void;
    onPressCancel?: (event: GestureResponderEvent) => void;
    session: UserSessionDto;
    isRefund?: boolean;
}

export function ConfirmModal({ 
    customRef, 
    onPressCancel, 
    onPressConfirm,
    session,
    isRefund = false,
}: ConfimModalProps) {
  const [info, setInfo] = useState<{
    messageAlert?: string;
    tempo?: string;
    numSerieEcobike?: string;
    faturamento?: string;
  }>({})

  const messageWarning = 
    'Caso a ecobike fique em sua pose acima do tempo estabelecido, você continuará a ser cobrado durante as 48 horas posteriores ao atraso.';
  
  function addUTC(dataString: string) {
    if (!dataString.endsWith('Z')) return `${dataString}Z`;
    return dataString;
  }
    
  function handleOnOpenModal() {
    const numSerieEcobike = session.user.ecobike?.numSerie || 'S/N';

    if (!isRefund) {
        const faturamento = calculateFaturamento(session.user.ecobike?.tempoPrevisto as number);
        const tempo = toHoursAndMinutes(session.user.ecobike?.tempoPrevisto as number);

        setInfo({
            numSerieEcobike,
            faturamento,
            tempo,
            messageAlert: messageWarning
        });
    } else {
        const start = moment(addUTC(session.user.ecobike?.dataHoraInicial as string));
        const end = moment();
        const tempoPrevisto = session.user.ecobike?.tempoPrevisto as number;

        const duration = moment.duration(end.diff(start)).asMinutes();

        const tempo = toHoursAndMinutes(duration);
        const faturamento = calculateFaturamento(duration);
        let message = '';

        if (duration > tempoPrevisto) {
            const faturamentoPrevisto = calculateFaturamento(tempoPrevisto);
            const faturamentoReal = calculateFaturamento(duration);

            const faturamentoAdicional = (+faturamentoReal - +faturamentoPrevisto).toFixed(2);

            message = 
                `A ecobike ultrapassou o tempo estabelecido de ${toHoursAndMinutes(tempoPrevisto)}. Logo, foi adicionado R$ ${faturamentoAdicional} equivalente aos minutos correntes`;
        }
 
        setInfo({
            numSerieEcobike,
            faturamento,
            tempo,
            messageAlert: message
        });
        
    }
  }

  function isLoading() {
    return !Object.keys(info).length;
  }

  return (
      <Modalize 
        ref={customRef}
        modalStyle={styles.modal}
        onOpen={handleOnOpenModal}
        modalTopOffset={100}
        scrollViewProps={{ 
            contentContainerStyle: { 
                height: '100%' 
            },
        }}
      >
        <View style={styles.container}>
            {isLoading() ?
                <ActivityIndicator 
                    color={THEME.COLORS.PRIMARY} 
                    size='large' 
                /> :
                <>
                    <Text style={styles.title}>
                        Você ja está no ecopoint
                    </Text>

                    <View>
                        <Text style={[styles.text, styles.modeloLabel]}>
                            Sua EcoBike
                        </Text>
                        <Text style={[styles.text, styles.modelo]}>
                            {info.numSerieEcobike}
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <MaterialIcons
                            name='directions-bike'
                            color={THEME.COLORS.PRIMARY}
                            size={60}
                        />
                        <Text style={[styles.text, styles.price]}>
                            R$ {info.faturamento}
                        </Text>
                        <Text style={[styles.text, styles.distance]}>
                            Por {info.tempo}
                        </Text>
                    </View>

                    {info.messageAlert &&    
                        <View style={styles.warn}>
                            <Text style={styles.text}>{info.messageAlert}</Text>
                        </View>
                    }

                    <View style={styles.buttonsContainer}>
                        <AppButton 
                            text={isRefund ? 'Confirmar' : 'Retirar'}
                            type='primary'
                            onPress={onPressConfirm}
                        />
                        
                        
                        <AppButton 
                            text='Cancelar'
                            type='secondary'
                            marginTop={15}
                            onPress={onPressCancel}
                        />
                    </View>
                </>
            }
        </View>
      </Modalize>
  );
};