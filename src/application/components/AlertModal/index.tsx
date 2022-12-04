import { Modalize } from 'react-native-modalize';
import { View, Text, GestureResponderEvent } from 'react-native';

import { AppButton } from '../AppButton';
import { styles } from './styles';

interface AlertModalProps {
    customRef: React.RefObject<Modalize>;
    onPressConfirm: (event: GestureResponderEvent) => void;
}

export function AlertModal({ 
    customRef,
    onPressConfirm,
}: AlertModalProps) {

  return (
      <Modalize 
        ref={customRef}
        modalStyle={styles.modal}
        modalTopOffset={300}
        scrollViewProps={{ 
            contentContainerStyle: { 
                height: '100%' 
            },
        }}
      >
        <View style={styles.container}>
            <Text style={styles.title}>ATENÇÃO</Text>

            <View>
                <Text style={styles.text}>
                    1. Posicione a ecobike no ecopoint
                </Text>

                <Text style={styles.text}>
                    2. Verifique se a trava de segurança foi acionada corretamente
                </Text>

                <Text style={styles.text}>
                    3. Confirme a devolução
                </Text>
            </View>
            <AppButton 
                text='Confirmar'
                type='primary'
                onPress={onPressConfirm}
            />
        </View>
      </Modalize>
  );
};