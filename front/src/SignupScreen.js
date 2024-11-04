import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [detected, setDetected] = useState(false);
  const [ocrData, setOcrData] = useState(null); // OCR 데이터를 저장할 상태
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 상태를 저장
  const [focusDepth, setFocusDepth] = useState(0); // 초점 깊이

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

  const handleOcr = async (base64Image) => {
    try {
      setIsProcessing(true); // OCR 요청 시작
      const response = await axios.post('http://192.168.0.53:5000/api/ocr', { base64Image });
      const extractedData = response.data.data;
      setOcrData(extractedData);
      setModalVisible(true); // OCR 데이터 확인을 위한 팝업 표시
    } catch (error) {
      Alert.alert('OCR 실패', '학생증 정보를 추출하지 못했습니다.');
    } finally {
      setIsProcessing(false); // OCR 요청 완료
    }
  };

  const handleOcrSuccess = () => {
    setModalVisible(false);
    navigation.navigate('StudentInfo', { extractedData: ocrData });
  };

  const handleOcrRetry = () => {
    setModalVisible(false);
    setDetected(false); // 다시 시도할 수 있도록 상태 초기화
  };

  // 학생증 감지 함수
  const onDetected = async () => {
    if (!detected && cameraRef && !isProcessing) {
      setDetected(true); // 감지 상태 변경

      // 화면에서 캡처 후 OCR 요청
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      handleOcr(data.base64); // OCR 요청
    }
  };

  // 촬영 버튼을 눌렀을 때만 감지 시작
  const handleCapturePress = async () => {
    await onDetected();
  };

  // 터치 이벤트를 사용해 초점 위치 설정
  const handleFocus = (event) => {
    const { locationY } = event.nativeEvent;
    const depth = locationY / 300; // 초점 깊이를 터치한 위치로 계산 (카메라 뷰 높이에 따라 조정)
    setFocusDepth(depth);
  };

  // 데이터 중 하나라도 인식되지 않은 경우를 확인하는 함수
  const isOcrDataIncomplete = () => {
    return !(ocrData?.['이름'] && ocrData?.['학과'] && ocrData?.['학번']);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학생증을 카메라 범위에 넣어주세요</Text>

      <TouchableWithoutFeedback onPress={handleFocus}>
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCameraRef(ref)}
            autoFocus={Camera.Constants.AutoFocus.on}  // 자동 초점 기능 추가
            focusDepth={focusDepth} // 초점 깊이 설정
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity onPress={handleCapturePress} style={styles.captureButton} disabled={isProcessing}>
        <Text style={styles.buttonText}>{isProcessing ? '처리 중...' : '촬영'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>학생 정보</Text>

            {/* OCR 데이터가 제대로 인식되지 않은 경우 */}
            {isOcrDataIncomplete() ? (
              <>
                <Text style={styles.errorText}>이름과 학과, 학번이 보이게 다시 시도해주세요!</Text>
                <TouchableOpacity onPress={handleOcrRetry} style={[styles.modalButton, styles.retryButton]}>
                  <Text style={styles.modalButtonText}>다시 하기</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* OCR 데이터가 존재하는 경우 */}
                <Text>이름: {ocrData['이름']}</Text>
                <Text>학과: {ocrData['학과']}</Text>
                <Text>학번: {ocrData['학번']}</Text>

                <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleOcrSuccess} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOcrRetry} style={[styles.modalButton, styles.retryButton]}>
                  <Text style={styles.modalButtonText}>다시 시도</Text>
                </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // 은은한 흰색 배경
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6a4f', // 은은한 초록색
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    width: 320,
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9', // 연한 초록색 배경으로 카메라 영역 강조
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    backgroundColor: '#95d5b2', // 부드러운 초록색 버튼
    padding: 12,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: '#95d5b2', // 부드러운 초록색 버튼
    padding: 10,
    margin: 5,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 80,
  },
  retryButton: {
    backgroundColor: '#ff7f7f', // 재시도 버튼: 밝은 빨강
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#ff7f7f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignupScreen;
