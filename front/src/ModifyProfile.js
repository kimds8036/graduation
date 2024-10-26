import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 추가
import RowBar from './Rowbar';

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

  return (
    <SafeAreaView style={styles.safeArea}>
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

        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="save-outline" size={24} color="black" />
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
      
      {/* RowBar를 SafeAreaView의 마지막 요소로 배치 */}
      <RowBar />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,  // SafeAreaView 전체를 채우도록 설정
  
  },
  container: {
    flex: 1,  // 컨텐츠 영역이 남는 공간을 모두 차지하도록
    paddingHorizontal: 15,
  },
  // 나머지 스타일 그대로
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
    borderRadius: 65, // 부모 컨테이너도 원형으로
    borderWidth: 2, // 실선 테두리 너비
    borderColor: '#00796b', // 실선 테두리 색상
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // 원형 이미지
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
    borderColor: '#ccc', // 테이블 테두리 색상
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableItem: {
    flex: 1, // 모든 아이템이 같은 크기로 설정됨
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1, // 셀 사이의 경계선
    borderColor: '#ccc', // 셀 경계선 색상
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTableItem: {
    backgroundColor: '#d0e6df', // 선택된 셀 배경색
  },
  tableItemText: {
    fontSize: 14,
    color: '#333', // 기본 텍스트 색상
  },
  selectedTableItemText: {
    fontWeight: 'bold', // 선택된 텍스트의 강조
    color: '#000', // 선택된 텍스트 색상
  },

  section: {
    marginBottom: 20, // 마지막 여백 설정
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
