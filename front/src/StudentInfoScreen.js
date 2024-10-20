import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const StudentInfoScreen = ({ route }) => {
  const { extractedData } = route.params; // SignupScreen에서 넘겨받은 OCR 데이터
  const [mbti, setMbti] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // 프로필 사진 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri); // 선택한 이미지를 설정
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>거의 다 왔어요😊</Text>

      <View style={styles.inputContainer}>
        <Text>이름</Text>
        <TextInput value={extractedData.name} editable={false} style={styles.input} />

        <Text>학과</Text>
        <TextInput value={extractedData.department} editable={false} style={styles.input} />

        <Text>학번</Text>
        <TextInput value={extractedData.studentId} editable={false} style={styles.input} />

        <Text>MBTI</Text>
        <TextInput value={mbti} onChangeText={setMbti} style={styles.input} />
      </View>

      <Text style={styles.profileText}>프로필을 추가해볼까요</Text>

      <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profilePlaceholderText}>press to select</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('정보가 저장되었습니다')} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  profileText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default StudentInfoScreen;
