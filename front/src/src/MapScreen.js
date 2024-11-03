import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [users, setUsers] = useState([]); // 사용자 데이터를 저장할 상태

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

    // 사용자 정보를 가져오는 함수
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
        console.log('Fetched users:', data); // 응답 데이터 확인
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
        mapRef.animateToRegion(newRegion, 1000); // 1초 동안 부드럽게 이동
      }
    } catch (error) {
      Alert.alert('위치 오류', '현재 위치를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => (mapRef = ref)}
        style={styles.map}
        region={region}
        showsUserLocation={true} // 현재 사용자 위치 표시
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {/* 사용자 위치에 마커 표시 */}
        {users.map((user) => (
          <Marker
            key={user._id}
            coordinate={{
              latitude: user.location.latitude,
              longitude: user.location.longitude,
            }}
            title={user.name} // 사용자의 이름을 마커 위에 표시
           // 추가로 설명에 사용자 이름을 표시
          />
        ))}
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
