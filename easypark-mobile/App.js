
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission GPS refusée');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const res = await axios.get('https://ton-backend.railway.app/api/parking');
        setParkingSpots(res.data);
      } catch (e) {
        console.error('Erreur API', e);
      }
    })();
  }, []);

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      await axios.post('https://ton-backend.railway.app/api/parking', {
        latitude,
        longitude,
        status: 'free'
      });
      setParkingSpots([...parkingSpots, { latitude, longitude }]);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de signaler cette place.');
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={location} title="Vous êtes ici" />
          {parkingSpots.map((spot, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
              pinColor="green"
              title="Place disponible"
            />
          ))}
        </MapView>
      ) : (
        <Text>Chargement de la position...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
