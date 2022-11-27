import { Modalize } from 'react-native-modalize';
import { View, Text, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppButton } from '../AppButton';
import { styles } from './styles';
import { THEME } from '../../theme';

import { calculateFaturamento, toHoursAndMinutes } from '../../utils';

interface ConfimModalProps {
    customRef: React.RefObject<Modalize>;
    onPressConfirm: (event: GestureResponderEvent) => void;
    onPressCancel: (event: GestureResponderEvent) => void;

    numSerieEcoBike: string;
    tempoPrevistoCorrida: number;
    isRefund?: boolean;
}

export function ConfirmModal({ 
    customRef, 
    onPressCancel, 
    onPressConfirm,
    numSerieEcoBike,
    tempoPrevistoCorrida,
    isRefund = false,
}: ConfimModalProps) {
  const messageAlert = !isRefund ?
    `Caso a ecobike fique em sua pose acima do tempo estabelecido, você continuará a ser cobrado durante as 48 horas posteriores ao atraso.` :
    ''


  return (
      <Modalize 
        ref={customRef}
        modalStyle={styles.modal}
        modalTopOffset={100}
        scrollViewProps={{ 
            contentContainerStyle: { 
                height: '100%' 
            },
        }}
      >
        <View style={styles.container}>
            <Text style={styles.title}>
                Você ja está no ecopoint
            </Text>

            <View>
                <Text style={[styles.text, styles.modeloLabel]}>
                    Sua EcoBike
                </Text>
                <Text style={[styles.text, styles.modelo]}>
                    {numSerieEcoBike}
                </Text>
            </View>

            <View style={styles.info}>
                <MaterialIcons
                    name='directions-bike'
                    color={THEME.COLORS.PRIMARY}
                    size={60}
                />
                <Text style={[styles.text, styles.price]}>
                    R$ {calculateFaturamento(tempoPrevistoCorrida)}
                </Text>
                <Text style={[styles.text, styles.distance]}>
                    Por {toHoursAndMinutes(tempoPrevistoCorrida)}
                </Text>
            </View>

            <View style={styles.warn}>
                <Text style={styles.text}>{messageAlert}</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <AppButton 
                    text='Retirar'
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
        </View>
      </Modalize>
  );
};