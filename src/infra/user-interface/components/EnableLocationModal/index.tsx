import { 
    View, 
    Modal,
    ModalProps,
    Text, 
    TouchableOpacity,
    GestureResponderEvent, 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { styles } from './styles';
import { THEME } from '../../theme';

interface EnableLocationModalProps extends ModalProps {
    onPressActive: (event: GestureResponderEvent) => void,
}

export function EnableLocationModal({ onPressActive, ...props }: EnableLocationModalProps) {
  return (
    <Modal 
        animationType='slide'
        transparent={true}
        {...props}
    >
        <View
            style={styles.container}
        >
            <View
                style={styles.modal}
            >
                <Text style={styles.title}>
                    Melhore sua experiência em nossa plataforma
                </Text>

                <View style={styles.content}>
                    <Text style={styles.textContent}>
                        Para encontrar um ecopoint mais rápido, ative a sua localização
                    </Text>

                    <FontAwesome 
                        name='map-marker' 
                        size={60} 
                        color={THEME.COLORS.PRIMARY} 
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={onPressActive}
                >
                    <Text style={styles.textButton}>Ativar agora</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
}