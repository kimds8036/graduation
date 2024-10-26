// src/SaveRouteScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import RowBar from './Rowbar';

const SaveRouteScreen = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 위치 권한 요청
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한이 필요합니다.');
        return;
      }
    })();
  }, []);

  // 트래킹 시작 시 위치와 시간을 추적
  useEffect(() => {
    let interval;
    if (tracking) {
      setStartTime(Date.now());
      interval = setInterval(async () => {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // 경과 시간 업데이트
      }, 1000); // 1초 간격으로 위치와 시간을 업데이트
    } else {
      clearInterval(interval);
      setElapsedTime(0);
      setLocation(null);
    }

    return () => clearInterval(interval);
  }, [tracking]);

  const handleTracking = () => {
    setTracking((prev) => !prev); // 트래킹 상태 변경
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 활동 반경을 알아볼까요?</Text>
      <Text style={styles.subtitle}>위치 정보 이용 동의를 해주세요!</Text>
      
      <View style={styles.iconContainer}>
        {/* 아이콘 부분 */}
        <Text style={styles.icon}>↕️</Text>
        <Text style={styles.icon}>~</Text>
        <Text style={styles.icon}>↕️</Text>
      </View>

      <View style={styles.mapIconContainer}>
        {/* 지도 아이콘 */}
        <Text style={styles.mapIcon}>🗺️</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleTracking}>
        <Text style={styles.buttonText}>{tracking ? '추적 중지하기' : '동선 추적하기'}</Text>
      </TouchableOpacity>

      {tracking && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>경과 시간: {elapsedTime}초</Text>
          {location && (
            <Text style={styles.infoText}>
              현재 위치: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      )}
      <RowBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  icon: {
    fontSize: 24,
  },
  mapIconContainer: {
    marginBottom: 20,
  },
  mapIcon: {
    fontSize: 50,
  },
  button: {
    backgroundColor: '#8FB299',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SaveRouteScreen;
