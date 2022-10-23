import { View } from 'react-native';
import MapView from 'react-native-maps';

import { styles } from './styles';

export function SearchEcoPoint() {
  return (
    <View style={styles.container}>
      <MapView
      style={{  
        width: "100%",
        height: "100%", 
      }}
      initialRegion={{
        latitude: -12.151496,
        longitude: -38.412672,
        latitudeDelta: 0.010,
        longitudeDelta: 0.010,
      }}
      >

      </MapView>
    </View>
  );
}