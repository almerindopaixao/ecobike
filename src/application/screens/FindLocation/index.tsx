import { View } from 'react-native';
import MapView from 'react-native-maps';

import { styles } from './styles';

export function FindLocation() {

  const initialState = {
    latitude: -12.151468,
    longitude: -38.414883,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010,
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{  
          width: "100%",
          height: "100%", 
        }}
        initialRegion={initialState}
      >
      </MapView>
    </View>
  );
}