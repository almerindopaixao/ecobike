import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from './styles';


import { MapGraph } from '../../core/maps/MapGraph';
import { GraphLoaderHelper } from '../../core/helpers/GraphLoaderHelper';

import roadMap from '../../data/maps/jardim-petrolar.json';

export function SearchEcoPoint() {
  const graph = MapGraph.getInstance();
  GraphLoaderHelper.loadRoadMap(roadMap, graph);

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
        {graph.vertices.map((value, index) => (
            <Marker image={{ uri: 'http://maps.google.com/mapfiles/kml/paddle/blu-diamond-lv.png' }} key={index} coordinate={value.toCordinates()} />
          )
        )}
      </MapView>
    </View>
  );
}