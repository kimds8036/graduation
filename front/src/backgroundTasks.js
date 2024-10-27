import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];

    // 서버로 위치 데이터를 전송하는 API 호출
    await axios.post('http://192.168.0.53:5000/api/tracking/update-tracking', {
      userId: await AsyncStorage.getItem('_id'),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
      day: new Date().toLocaleDateString('ko-KR', { weekday: 'long' })
    });
  }
});
