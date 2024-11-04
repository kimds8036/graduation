import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Rowbar from './Rowbar';



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
        style={{ flex: 1 }}
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

      {/* 내 위치 버튼 */}
      <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
        <Ionicons name="compass-outline" size={22} color="black" />
      </TouchableOpacity>

      {/* 하단 Rowbar */}
      <SafeAreaView style={styles.rowbarContainer}>
        <Rowbar />
      </SafeAreaView>
    </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // 추가하여 내 위치 버튼이 겹치지 않도록
  },
  locationButton: {
    position: 'absolute',
    bottom: 110, // Rowbar 위에 위치하도록 조정
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
  rowbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: 10,
    alignItems: 'stretch',
  },
});
