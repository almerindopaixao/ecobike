import { View, Image, Text } from "react-native";

import { styles } from './styles';

import tempImage from '../../assets/images/temp-image.jpg';

interface EcoPointMarkerProps {
    image_url?: string;
    name: string;
}

export function EcoPointMarker({ image_url, name }: EcoPointMarkerProps) {
 return (
    <View style={styles.container}>
        <Image 
            style={styles.image}
            source={tempImage}
        />
        <Text style={styles.title}>{name}</Text>
    </View>
 );  
}