import { View, Image, Text } from "react-native";

import { styles } from './styles';

interface EcoPointMarkerProps {
    image_url: string;
    name: string;
}

export function EcoPointMarker({ image_url, name }: EcoPointMarkerProps) {
 return (
    <View style={styles.container}>
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