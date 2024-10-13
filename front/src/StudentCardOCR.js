import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';


export default function StudentCardOCR() {
  const [hasPermission, setHasPermission] = useState(null);  // 카메라 권한 상태
  const [cameraRef, setCameraRef] = useState(null);          // 카메라 참조 상태
  const [ocrText, setOcrText] = useState('');                // OCR 결과 텍스트
  const [loading, setLoading] = useState(false);             // OCR 처리 중 로딩 상태

  // 카메라 권한 요청
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        // 권한이 거부되면 팝업으로 설정 화면으로 유도
        Alert.alert(
          '카메라 권한 요청',
          '카메라 권한이 필요합니다. 카메라를 사용하려면 권한을 허용해주세요.',
          [
            {
              text: '설정으로 이동',
              onPress: () => Linking.openSettings(),
            },
            { text: '취소', style: 'cancel' },
          ]
        );
      }
    })();
  }, []);

  const performOcr = async (imageUri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'student_card.jpg',
      });

      const response = await fetch('https://naveropenapi.apigw.ntruss.com/vision-ocr/v1/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-NCP-APIGW-API-KEY-ID': 'YOUR_CLIENT_ID', // 네이버 클라우드 Client ID
          'X-NCP-APIGW-API-KEY': 'YOUR_CLIENT_SECRET', // 네이버 클라우드 Client Secret
        },
        body: formData,
      });

      const result = await response.json();
      setOcrText(result.images[0].fields.map((field) => field.inferText).join(' '));
    } catch (error) {
      console.error('OCR failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.permissionContainer}><Text>권한 확인 중...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.permissionContainer}><Text>카메라 권한이 필요합니다.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학과를 알려주세요😊</Text>
      <Text style={styles.subTitle}>본인명의 학생증만 인식가능해요</Text>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={async () => {
          if (cameraRef) {
            const data = await cameraRef.takePictureAsync();
            performOcr(data.uri); // 찍은 사진으로 OCR 처리
          }
        }}
      >
        <Text style={styles.buttonText}>학생증 촬영</Text>
      </TouchableOpacity>

      {loading ? <Text>OCR 작업 중...</Text> : ocrText ? <Text>OCR 결과: {ocrText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.6,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

