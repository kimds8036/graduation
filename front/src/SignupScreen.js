import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera/legacy'; // Legacy 버전 사용
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [detected, setDetected] = useState(false);  // 감지된 상태 저장

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />; // 권한을 요청하는 동안 빈 화면
  }

  if (hasPermission === false) {
    return <Text>카메라 권한이 필요합니다.</Text>; // 권한이 없을 때 메시지
  }

  // 자동 OCR 처리 함수
  const handleOcr = async (base64Image) => {
    try {
      const response = await axios.post('http://10.112.106.54:5000/api/ocr', { base64Image });
      const extractedData = response.data.data;
      Alert.alert('OCR 성공', '학생증 정보가 추출되었습니다.');
      navigation.navigate('StudentInfoScreen', { extractedData });
    } catch (error) {
      console.error('OCR 처리 중 오류:', error);
      Alert.alert('OCR 실패', '학생증 정보를 추출하지 못했습니다.');
    }
  };

  // 학생증 감지 함수
  const onDetected = async () => {
    if (!detected && cameraRef) {
      setDetected(true); // 감지 상태 변경

      // 화면에서 캡처 후 OCR 요청
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      handleOcr(data.base64); // OCR 요청
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학생증을 카메라 범위에 넣어주세요</Text>

      <View style={styles.cameraContainer}>
      <Camera
  style={styles.camera}
  type={Camera.Constants.Type.back}
  ref={(ref) => setCameraRef(ref)}
  onCameraReady={onDetected}  // 카메라가 준비되면 자동으로 감지 시작
  autoFocus={Camera.Constants.AutoFocus.on}  // 자동 초점 기능 추가
/>
      </View>

      {detected && <Text>학생증이 감지되었습니다. 자동 인식 중...</Text>}
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
    fontSize: 20,
    marginBottom: 16,
  },
  cameraContainer: {
    width: 300,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

export default SignupScreen;
