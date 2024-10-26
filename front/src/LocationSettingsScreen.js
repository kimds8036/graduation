import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import Slider from '@react-native-community/slider'; // Slider 컴포넌트 사용

function LocationSettingsScreen() {
  const [distance, setDistance] = useState(600); // 초기 범위 값을 600m로 설정

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>위치 정보 공개 범위</Text>
      </View>

      {/* 설명 텍스트 */}
      <Text style={styles.description}>
        친구에게 보여줄 위치 범위를 설정하세요!
      </Text>

      {/* 슬라이더 */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>범위</Text>
        <Slider
          style={styles.slider}
          minimumValue={600}
          maximumValue={3000}
          step={100}
          value={distance}
          onValueChange={(value) => setDistance(value)}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007AFF"
        />
        <View style={styles.distanceLabels}>
          <Text style={styles.distanceText}>600m</Text>
          <Text style={styles.distanceText}>3km</Text>
        </View>
      </View>

      {/* 선택된 범위 표시 */}
      <Text style={styles.selectedDistanceText}>선택된 범위: {distance}m</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  distanceText: {
    fontSize: 14,
  },
  selectedDistanceText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
});

export default LocationSettingsScreen;
