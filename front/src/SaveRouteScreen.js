import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import * as Location from 'expo-location';
import RowBar from './Rowbar'; // 경로는 프로젝트에 맞게 수정

const SaveRouteScreen = () => {
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTrackingStatus = async () => {
      const isTracking = await AsyncStorage.getItem('isTracking');
      if (isTracking === 'true') {
        setTracking(true);
      }
    };
    checkTrackingStatus();
  }, []);

  const startTracking = async () => {
    setLoading(true);

    const storedId = await AsyncStorage.getItem('_id');
    if (!storedId) {
      Alert.alert('로그인 정보가 없습니다.');
      setLoading(false);
      return;
    }

    Alert.alert('동선 추적을 시작합니다!', '동선 추적은 앱이 활성화된 동안에만 작동합니다.');

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 접근 권한이 필요합니다.');
        setLoading(false);
        return;
      }

      // 현재 위치 가져오기
      let currentLocation = await Location.getCurrentPositionAsync({});
      await axios.post('http://192.168.0.53:5000/api/tracking/start-tracking', {
        userId: storedId,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        day: new Date().toLocaleDateString('ko-KR', { weekday: 'long' }),
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem('isTracking', 'true');
      setTracking(true);

      // 포그라운드에서 위치 추적 시작
      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,  // 5초마다 업데이트
        distanceInterval: 50, // 50미터마다 업데이트
      }, (location) => {
        // 위치 정보 서버로 전송
        axios.post('http://192.168.0.53:5000/api/tracking/update-tracking', {
          userId: storedId,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          day: new Date().toLocaleDateString('ko-KR', { weekday: 'long' }),
          timestamp: new Date().toISOString(),
        });
      });

    } catch (error) {
      console.error('동선 추적 시작 중 오류:', error);
      Alert.alert('동선 추적 시작 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = async () => {
    const storedId = await AsyncStorage.getItem('_id');
    if (!storedId) {
      Alert.alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});

      // 서버에 동선 추적 중단 요청, 현재 위치 데이터 포함
      await axios.post('http://192.168.0.53:5000/api/tracking/stop-tracking', {
        userId: storedId,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        day: new Date().toLocaleDateString('ko-KR', { weekday: 'long' }),
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem('isTracking', 'false');
      setTracking(false);

      Alert.alert('동선 추적이 중단되었습니다.');
    } catch (error) {
      console.error('동선 추적 중단 중 오류:', error);
      Alert.alert('동선 추적 중단 중 오류가 발생했습니다.');
    }
  };

  const handleTrackingToggle = () => {
    if (tracking) {
      Alert.alert('동선 추적 취소', '동선 추적을 중단하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: stopTracking },
      ]);
    } else {
      startTracking();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>나의 활동 반경을 알아볼까요?</Text>

        <TouchableOpacity style={styles.button} onPress={handleTrackingToggle}>
          <Text style={styles.buttonText}>{tracking ? '동선 추적 중단하기' : '동선 추적하기'}</Text>
        </TouchableOpacity>

        {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>동선 추적 중...</Text>
        </View>
      )}
    </View>
    <RowBar />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8FB299',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 반투명 배경
  },
});

export default SaveRouteScreen;
