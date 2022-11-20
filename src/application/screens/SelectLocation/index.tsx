import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

import { LocationMarker, Loading } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { LocationDto } from '../../../domain/dtos/Location.dto';
import { ClientHttp } from '../../../infra/http/client.http';
import { LocationIQRepository } from '../../../infra/repositories/locationiq/locationiq.repository';
import { GetAddressFromLatAndLngUseCase } from '../../../domain/usecases/get-address-from-lat-and-lng.usecase';
import { GetLatAndLngFromAddressUseCase } from '../../../domain/usecases/get-lat-and-lng-from-address.usecase';


export function SelectLocation() {
  const LAT_DELTA = 0.010;
  const LNG_DELTA = 0.010;

  const clientHttp = ClientHttp.getInstance();
  const locationIQRepository = LocationIQRepository.getInstance(clientHttp);

  const getAddressFromLatAndLngUseCase = GetAddressFromLatAndLngUseCase.getInstance(locationIQRepository);
  const getLatAndLngFromAddressUseCase = GetLatAndLngFromAddressUseCase.getInstance(locationIQRepository);

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LAT_DELTA,
    longitudeDelta: LNG_DELTA,
  });
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [input, setInput] = useState<string>();
  const [data, setData] = useState<LocationDto[]>([]);
  const [isFocusInput, setIsFocusInput] = useState<boolean>(false);

  function formateAddress(location: Pick<LocationDto, 'address'>) {
    const bairro = location.address.suburb ? `, ${location.address.suburb}` : '';
    const cidade = location.address.city ? `, ${location.address.city}` : '';
    const logradouro = `${location.address.name}${bairro}${cidade}`;
    const estado = location.address.state ? `${location.address.state}, ` : '';

    return `${logradouro}, ${estado}${location.address.country}`;
  }

  async function handleChangeText(text: string) {
    setInput(text);

    if (text.length < 3) return;
    const res = await getLatAndLngFromAddressUseCase.execute(text);
    if (res.length > 0) setData(res);
  }

  function handlePressSelectItem(location: LocationDto) {
    // Dismisses the active keyboard and removes focus.
    Keyboard.dismiss();

    setRegion({
      ...region,
      latitude: location.latitude,
      longitude: location.longitude
    });

    // Set user location
    setUserLocation([location.latitude, location.longitude]);

    // Set input text
    setInput(formateAddress(location));
  }

  useEffect(() => {
    console.log('Renderizou FindLocation');

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsFocusInput(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsFocusInput(false);
        setData([]);
      }
    );

    (async () => {
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setRegion({
        ...region,
        latitude: latitude,
        longitude: longitude
      });

      const address = await getAddressFromLatAndLngUseCase.execute(latitude, longitude);
      setInput(address);
      setUserLocation([latitude, longitude]);
    })();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  }, []);

  return (
    <View style={styles.container}>
      
      {region.latitude === 0 ? <Loading bottom={100} /> : (
        <MapView
          style={styles.map}
          onPress={(event) => setUserLocation([
              event.nativeEvent.coordinate.latitude, 
              event.nativeEvent.coordinate.longitude
            ])
          }
          region={region}
          initialRegion={region}
        >
          <Marker
            coordinate={{
              latitude: userLocation[0],
              longitude: userLocation[1],
            }}
          >
            <LocationMarker size={50} />
          </Marker>
        </MapView>
      )}
      <View 
        style={isFocusInput ? { ...styles.form, top: 0 } : { ...styles.form }}
      >
        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            onChangeText={handleChangeText}
            value={input}
            clearButtonMode='always'
            placeholder='Qual é a sua localização ?'
          />
          <TouchableOpacity 
            style={styles.clearInputIcon}
            onPress={() => setInput('')}
          >
            <MaterialIcons 
              name='cancel'
              size={20}
              color={THEME.COLORS.ERROR}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressSelectItem(item)}
            >
              <View style={styles.autocomplete} >
                <MaterialIcons
                  name='location-city'
                  color={THEME.COLORS.SECONDARY}
                  size={35}
                />
                <View style={styles.autocompleteItem}>
                  <Text style={styles.autocompleteTextItem}>
                    {item.address.name}
                    {item.address.suburb ? `, ${item.address.suburb}` : ''}, {item.address.city}
                  </Text>
                  <Text style={styles.autocompleteTextItem}>
                  {item.address.state ? `${item.address.state}, ` : ''}{item.address.country}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_, idx) => `${idx}`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        />

        <TouchableOpacity
          style={styles.button}
        >
            <Text
              style={styles.textButton}
            >
              Próximo
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}