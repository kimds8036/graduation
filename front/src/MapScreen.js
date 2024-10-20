import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

      mapRef.animateToRegion(newRegion, 1000); // 1초 동안 부드럽게 이동
    } catch (error) {
      Alert.alert('위치 오류', '현재 위치를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => (mapRef = ref)} // MapView 참조를 설정하여 animateToRegion을 사용할 수 있도록 함
        style={styles.map}
        region={region}
        showsUserLocation={false} // 파란 점 제거
        onRegionChangeComplete={region => setRegion(region)}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="현재 위치"
          >
            <Image
              source={require('../assets/custom-marker.png')} // 원하는 이미지 파일 경로
              style={{ width: 40, height: 40 }} // 이미지 크기 조정
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
        <Ionicons name="compass-outline" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30, // 동그란 버튼
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
    width: 40, // 버튼 크기
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
