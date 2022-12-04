import { View, Image, Text } from "react-native";

import { styles } from './styles';

interface EcoPointMarkerProps {
    image_url: string;
    name: string;
    disabled?: boolean;
}

export function EcoPointMarker({ image_url, name, disabled = false }: EcoPointMarkerProps) {
 return (
    <View style={[styles.container, disabled && styles.disabled]}>
        <Image 
            style={styles.image}
            source={{
                uri: image_url
            }}
        />
        <Text style={styles.title}>{name}</Text>
    </View>
 );  
}