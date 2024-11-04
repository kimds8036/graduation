import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // Expo Image Picker 사용
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const MBTI_OPTIONS = [
  { label: '미정', value: '미정' },
  { label: 'ISTJ', value: 'ISTJ' },
  { label: 'ISFJ', value: 'ISFJ' },
  { label: 'INFJ', value: 'INFJ' },
  { label: 'INTJ', value: 'INTJ' },
  { label: 'ISTP', value: 'ISTP' },
  { label: 'ISFP', value: 'ISFP' },
  { label: 'INFP', value: 'INFP' },
  { label: 'INTP', value: 'INTP' },
  { label: 'ESTP', value: 'ESTP' },
  { label: 'ESFP', value: 'ESFP' },
  { label: 'ENFP', value: 'ENFP' },
  { label: 'ENTP', value: 'ENTP' },
  { label: 'ESTJ', value: 'ESTJ' },
  { label: 'ESFJ', value: 'ESFJ' },
  { label: 'ENFJ', value: 'ENFJ' },
  { label: 'ENTJ', value: 'ENTJ' },
  
];


const StudentInfoScreen = ({ route }) => {
  const { extractedData = {} } = route.params || {};
  const [mbti, setMbti] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 회원가입 중인지 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal 상태 관리

  const navigation = useNavigation();  // 네비게이션 훅 사용

  // 이미지 선택 함수
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('사진 접근 권한이 필요합니다!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);  // 선택한 이미지의 URI를 설정
    }
  };
  
  
    // MBTI 선택 함수
    const handleMbtiSelect = (value) => {
      setMbti(value);
      setIsDropdownVisible(false);  // 선택 후 모달 닫기
    };
  
    // 드롭다운 모달 열기/닫기 함수
    const toggleDropdown = () => {
      setIsDropdownVisible(!isDropdownVisible);  // 현재 상태를 토글
    };
    

    const handleSubmit = async () => {
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
        return;
      }
    

      setIsSubmitting(true); // 회원가입 중 상태 설정
      setIsModalVisible(true); // Modal 표시
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: profileImage,
          name: `profile_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
    
        try {
          // 1. Firebase Storage에 이미지 업로드
          const imageResponse = await axios.post('http://192.168.0.53:5000/api/upload/uploadProfileImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const profileImageUrl = imageResponse.data.downloadURL;
          console.log('이미지 업로드 성공:', profileImageUrl);
    
          // 2. MongoDB에 사용자 정보 저장
          const userData = {
            name: extractedData['이름'],
            username,
            password,
            department: extractedData['학과'],
            studentId: extractedData['학번'],
            mbti,
            profileImageUrl,
          };
    
          const response = await axios.post('http://192.168.0.53:5000/api/auth/signup', userData);
          console.log('회원가입 성공:', response.data);
          setIsSubmitting(false); // 회원가입 완료 상태로 변경
          setIsModalVisible(false); // Modal 닫기
          alert('회원가입이 완료되었습니다.');
          navigation.navigate('Login');
        } catch (error) {
          setIsSubmitting(false);
          setIsModalVisible(false); // Modal 닫기
          if (error.response && error.response.status === 400) {
            // 백엔드에서 400 에러가 발생하면 팝업 표시
            alert(error.response.data.error);  // 이미 생성된 계정이 있을 때의 에러 메시지 표시
          } else {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
          }
        }
      }
    };
    
    
  
// 비밀번호 확인 함수
// 비밀번호 확인 함수 (수정 후)
const handleConfirmPasswordChange = (text) => {
  setConfirmPassword(text);
  setIsPasswordMatch(password === text);  // 비밀번호와 일치 여부만 확인
};




  const uploadImageToFirebase = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();  // 이미지 파일을 Blob 형식으로 변환
  
    const storageRef = firebase.storage().ref().child(`profileImages/${Date.now()}`);  // Firebase 스토리지 참조 생성
    const snapshot = await storageRef.put(blob);  // Blob을 Firebase에 업로드
  
    const downloadURL = await snapshot.ref.getDownloadURL();  // 다운로드 URL 얻기
    return downloadURL;
  };
  

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.title}>거의 다 왔어요😊</Text>

      <View style={styles.inputContainer}>
        <Text>이름</Text>
        <TextInput value={extractedData['이름'] || ''} editable={false} style={[styles.input, styles.readOnlyInput]} />

        <Text>학과</Text>
        <TextInput value={extractedData['학과'] || ''} editable={false} style={[styles.input, styles.readOnlyInput]} />

        <Text>학번</Text>
        <TextInput value={extractedData['학번'] || ''} editable={false} style={[styles.input, styles.readOnlyInput]} />

        <Text>아이디</Text>
        <TextInput value={username} onChangeText={setUsername} placeholder="아이디 입력" style={styles.input} />

        <Text>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호 입력"
          secureTextEntry
          style={styles.input}
        />

        <Text>비밀번호 확인</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder="비밀번호 확인"
          secureTextEntry
          style={[
            styles.input, 
            confirmPassword && (isPasswordMatch ? styles.match : styles.noMatch)
          ]}
        />



<Text style={styles.label}>MBTI</Text>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>{mbti || 'MBTI 선택'}</Text>
      </TouchableOpacity>

      <Modal visible={isDropdownVisible} transparent={true} animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleDropdown}>
            <View style={styles.dropdownMenu}>
              <ScrollView>
                {MBTI_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.dropdownItem}
                    onPress={() => handleMbtiSelect(option.value)}
                  >
                    <Text style={styles.dropdownItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* 프로필 이미지 선택 */}
        <Text style={styles.profileText}>프로필을 추가해볼까요</Text>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} resizeMode="cover" />
          ) : (
            <Text style={styles.profilePlaceholderText}>press to select</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
      {/* 회원가입 중일 때 모달 표시 */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.modalText}>회원가입 중입니다...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f9f9f9', // 은은한 흰색 배경
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f', // 부드러운 초록색
    marginBottom: 20,
    marginTop: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  readOnlyInput: {
    backgroundColor: '#e0e0e0',
    color: '#888',
  },
  match: {
    borderColor: '#2d6a4f',  // 비밀번호가 일치할 때의 초록색 테두리
  },
  noMatch: {
    borderColor: '#ff6b6b',  // 비밀번호가 일치하지 않을 때의 빨간색 테두리
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555', // 어두운 회색
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#555',
  },
  profileText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#e6f0e9', // 은은한 초록 배경
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  profilePlaceholderText: {
    fontSize: 14,
    color: '#888',
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: '#95d5b2', // 부드러운 초록색 버튼
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#555',
  },
});


export default StudentInfoScreen;
