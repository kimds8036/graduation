import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function ProfileEditScreen() {
  const navigation = useNavigation();
  const [mbti, setMbti] = useState('INFP');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    ['음악', '게임', '영화', '공부'],
    ['운동', '요리', '애완동물', '패션'],
    ['독서', '아이돌', '애니', '종교'],
  ];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = () => {
    axios.post('http://192.168.24.108:5000/api/user/profile', {
      mbti: mbti,
      categories: selectedCategories,
    })
    .then(response => {
      Alert.alert("저장 성공", "프로필이 저장되었습니다.");
      navigation.navigate('SettingsScreen');
    })
    .catch(error => {
      Alert.alert("저장 실패", "프로필 저장 중 오류가 발생했습니다.");
      console.error(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}> 
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: 'https://source.unsplash.com/random/200x200?person' }}
            style={styles.profileImage}
          />
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>프로필 사진 변경</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mbtiSection}>
        <Text style={styles.mbtiLabel}>MBTI</Text>
        <TextInput
          style={styles.mbtiInput}
          value={mbti}
          onChangeText={(text) => setMbti(text)}
          placeholder="MBTI 입력"
          maxLength={4}
        />
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={24} color="black" />
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 15, // 상하 여백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10, // 하단 여백 추가
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
  mbtiSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mbtiLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  mbtiInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#00796b',
    fontSize: 18,
    padding: 5,
    width: 80,
    textAlign: 'center',
    color: '#00796b',
  },
  table: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10, // 상하 여백 추가
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
    paddingVertical: 12,
    marginHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40, // 하단 여백 추가
  },
  saveButtonText: {
    fontSize: 18,
    color: '#00796b',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileEditScreen;
