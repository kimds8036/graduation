import * as Location from 'expo-location';

export const startBackgroundTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('백그라운드 위치 추적 권한이 필요합니다.');
    return;
  }

  await Location.startLocationUpdatesAsync('background-location-task', {
    accuracy: Location.Accuracy.High,
    timeInterval: 60000, // 1분마다 업데이트
    distanceInterval: 50, // 50미터마다 업데이트
  });
};
