import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // Expo Image Picker 사용
import axios from 'axios';


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
      } else {
        if (profileImage) {
          const formData = new FormData();
          formData.append('file', {
            uri: profileImage,
            name: `profile_${Date.now()}.jpg`,
            type: 'image/jpeg',
          });
    
          try {
            const response = await axios.post('http://192.168.0.53:5000/api/upload/uploadProfileImage', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            const downloadURL = response.data.downloadURL;
            console.log('이미지 업로드 성공:', downloadURL);
    
            // 이후 서버로 사용자 정보 전송 로직 추가
            alert('회원가입이 완료되었습니다.');
          } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
          }
        }
      }
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
          onChangeText={setConfirmPassword}
          placeholder="비밀번호 확인"
          secureTextEntry
          style={styles.input}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
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
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  readOnlyInput: {
    backgroundColor: '#e0e0e0',
    color: '#888',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: 16,
  },
  profileText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  profilePlaceholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});


export default StudentInfoScreen;
