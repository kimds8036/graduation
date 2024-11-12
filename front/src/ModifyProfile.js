import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RowBar from './Rowbar';
import * as ImagePicker from 'expo-image-picker';

function ProfileEditScreen() {
  const navigation = useNavigation();
  const [mbti, setMbti] = useState('INFP');
  const [gender, setGender] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    ['음악', '게임', '영화', '공부'],
    ['운동', '요리', '애완동물', '패션'],
    ['독서', '아이돌', '애니', '종교'],
  ];

  const mbtiOptions = ['INFP', 'ENFJ', 'ISTJ', 'ENTP'];

  // 현재 로그인 사용자 프로필 URL 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://192.168.0.53:5000/api/getUserProfile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.profilePicture) {
          setProfilePicture(data.profilePicture); // DB에서 가져온 프로필 이미지 URL
        }
      } catch (error) {
        console.error('프로필 이미지를 불러오는 중 오류:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const selectProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri); // 새로운 이미지 URL로 상태 업데이트
    }
  };

  const saveProfile = async () => {
    try {
      const response = await fetch('http://192.168.0.53:5000/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123', // 실제 로그인된 사용자 ID를 여기에 추가해야 합니다
          mbti,
          gender,
          categories: selectedCategories,
          profilePicture, // 필요시 base64로 변환하여 전송
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('프로필이 성공적으로 업데이트되었습니다');
      } else {
        alert(data.error || '업데이트 실패');
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>프로필 수정</Text>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={profilePicture ? { uri: profilePicture } : { uri: 'https://source.unsplash.com/random/200x200?person' }}
                style={styles.profileImage}
              />
            </View>
            <TouchableOpacity style={styles.changePhotoButton} onPress={selectProfilePicture}>
              <Text style={styles.changePhotoText}>프로필 사진 변경</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.genderSection}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderSelection}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
                onPress={() => setGender('male')}
              >
                <Text style={styles.genderText}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
                onPress={() => setGender('female')}
              >
                <Text style={styles.genderText}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mbtiSection}>
            <Text style={styles.mbtiLabel}>MBTI</Text>
            <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
              <Text style={styles.dropdownText}>{mbti || 'MBTI 선택'}</Text>
            </TouchableOpacity>
            <Modal visible={isDropdownOpen} transparent={true} animationType="fade">
              <TouchableOpacity style={styles.modalOverlay} onPress={toggleDropdown}>
                <View style={styles.dropdownMenu}>
                  <ScrollView>
                    {mbtiOptions.map((option) => (
                      <TouchableOpacity key={option} onPress={() => { setMbti(option); toggleDropdown(); }}>
                        <Text style={styles.dropdownItem}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View style={styles.table}>
            {categories.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((category, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.tableItem,
                      selectedCategories.includes(category) && styles.selectedTableItem,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.tableItemText,
                        selectedCategories.includes(category) && styles.selectedTableItemText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Ionicons name="save-outline" size={24} color="black" />
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>

        <RowBar />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
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
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#00796b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoButton: {
    backgroundColor: '#e0f7fa',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#00796b',
    fontWeight: 'bold',
  },
  genderSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#00796b',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: '#d0e6df',
  },
  genderText: {
    fontSize: 14,
    color: '#333',
  },
  mbtiSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  mbtiLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdown: {
    borderBottomWidth: 1,
    borderBottomColor: '#00796b',
    paddingVertical: 5,
    width: 80,
    textAlign: 'center',
  },
  dropdownText: {
    color: '#00796b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#00796b',
  },
  table: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableItem: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTableItem: {
    backgroundColor: '#d0e6df',
  },
  tableItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTableItemText: {
    fontWeight: 'bold',
    color: '#000',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#88aa99',
    paddingVertical: 10,
    marginHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#00796b',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileEditScreen;
