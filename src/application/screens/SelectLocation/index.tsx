import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { useEffect, useState, useContext } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '../../context/app.provider';
import { LocationMarker, Loading, AppButton } from '../../components';
import { styles } from './styles';
import { THEME } from '../../theme';

import { LocationDto } from '../../../dtos/location.dto';
import { ClientHttp } from '../../../infra/http/client.http';
import { LocationIQRepository } from '../../../infra/repositories/locationiq/locationiq.repository';
import { GeocodingController } from '../../../controllers/geocoding.controller';
const { 
  LAT_DELTA = '', 
  LNG_DELTA = '' 
} = Constants.expoConfig?.extra || {}

export function SelectLocation() {
  const clientHttp = ClientHttp.getInstance();
  const locationIQRepository = LocationIQRepository.getInstance(clientHttp);
  const geocodingController = GeocodingController.getInstance(locationIQRepository);

  const navigation = useNavigation();
  const [app, setApp] = useContext(AppContext);

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
  const [input, setInput] = useState<string>();
  const [data, setData] = useState<LocationDto[]>([]);
  const [isFocusInput, setIsFocusInput] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(true);

  function handleGoSelectUsageTime() {
    navigation.navigate('SelectUsageTime');
  }

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
    const res = await geocodingController.getLatAndLngFrom(text);
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
    setApp({
      ...app,
      start_point: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });

    // Set input text
    setInput(formateAddress(location));
  }

  useEffect(() => {
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

      const address = await geocodingController.getAddressFrom(latitude, longitude);
      setInput(address);

      setApp({
        ...app,
        start_point: {
          latitude,
          longitude
        }
      });
    })();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  }, []);

  return (
    <>
    {showInfo && (
      <TouchableWithoutFeedback
        onPress={() => setShowInfo(false)}
      >
        <View style={styles.info}>
          <MaterialIcons 
            name='touch-app'
            size={80}
            color={THEME.COLORS.SECONDARY}
          />
          <Text style={styles.infoTitle}>Toque no mapa para editar sua localização</Text>
        </View>
      </TouchableWithoutFeedback>
      )
    }
    <View style={styles.container}>
      {region.latitude === 0 ? <Loading bottom={100} /> : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onPress={(event) => setApp({
              ...app,
              start_point: {
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude
              }
            })
          }
          region={region}
          initialRegion={region}
        >
          <Marker
            coordinate={{
              latitude: app.start_point.latitude,
              longitude: app.start_point.longitude,
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

        <AppButton
          disabled={app.start_point.latitude === 0}
          type={app.start_point.latitude === 0 ? 'secondary' : 'primary'}
          text='Próximo'
          onPress={handleGoSelectUsageTime}
          marginTop={50} 
        />
      </View>
    </View>
    </>
  );
}