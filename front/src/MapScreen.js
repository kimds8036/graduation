import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import RowBar from './Rowbar'; // src 폴더에 RowBar가 있는 경우 경로 조정

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [users, setUsers] = useState([]);

  let mapRef = null;

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 오류', '위치 접근 권한이 필요합니다.');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (error) {
        console.log('Error getting location:', error);
        Alert.alert('위치 오류', '위치를 가져오는 중 오류가 발생했습니다.');
      }
    })();

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.24.108:5000/api/users/all', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log('Error fetching users:', error);
        Alert.alert('사용자 정보 오류', '사용자 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchUsers();
  }, []);

  const goToCurrentLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      if (mapRef) {
        mapRef.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      Alert.alert('위치 오류', '현재 위치를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={(ref) => (mapRef = ref)}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onRegionChangeComplete={(region) => setRegion(region)}
        >
          {users.map((user) => (
            <Marker
              key={user._id}
              coordinate={{
                latitude: user.location.latitude,
                longitude: user.location.longitude,
              }}
              title={user.name}
            />
          ))}
        </MapView>

        <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
          <Ionicons name="compass-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <RowBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 10, // RowBar 높이를 제외한 MapView 높이
  },
  locationButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
