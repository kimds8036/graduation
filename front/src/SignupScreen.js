import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

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

  // 백엔드로 OCR 요청
  const handleOcr = async (imageUri) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ocr', { base64Image: imageUri });
      const extractedData = response.data.data;
      Alert.alert('OCR 성공', '학생증 정보가 추출되었습니다.');
      navigation.navigate('StudentInfoScreen', { extractedData });
    } catch (error) {
      console.error('OCR 처리 중 오류:', error);
      Alert.alert('OCR 실패', '학생증 정보를 추출하지 못했습니다.');
    }
  };

  // 사진 촬영 및 OCR 요청
  const takePictureAndProcess = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      handleOcr(data.base64); // 촬영한 사진을 OCR로 처리
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
        />
      </View>

      <TouchableOpacity onPress={takePictureAndProcess} style={styles.captureButton}>
        <Text style={styles.captureText}>학생증 인식</Text>
      </TouchableOpacity>
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
  captureButton: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  captureText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignupScreen;
