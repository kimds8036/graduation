import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from './TopBar';

const departments = [
  '무관','간호학과', '경영학과', '경제통상학과', '경찰학과', '골프산업학과', 
  '녹색기술융합학과', '메카트로닉스공학과', '문헌정보학과', '미디어콘텐츠학과', 
  '바이오메디컬공학과', '바이오의약학과', '뷰티화장품학과', '사회복지학과', 
  '산업디자인학과', '생명공학과', '소방방재융합학과', '스포츠건강학과', 
  '시각영상디자인학과', '식품영양학과', '실내디자인학과', '에너지신소재공학과', 
  '유아교육과', '의예과', '조형예술학과', '컴퓨터공학과', '패션디자인학과'
];

const genders = ['남', '여', '무관'];
const categories = ['0', '1', '2', '3', '4'];

const MatchingPage = () => {
  const navigation = useNavigation();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDepartmentListVisible, setIsDepartmentListVisible] = useState(false);

  const toggleDepartment = (department) => {
    if (department === '무관') {
      if (selectedDepartments.includes('무관')) {
        setSelectedDepartments([]);
      } else {
        setSelectedDepartments(['무관']);
      }
    } else {
      if (selectedDepartments.includes('무관')) {
        setSelectedDepartments([department]);
      } else if (selectedDepartments.includes(department)) {
        setSelectedDepartments(selectedDepartments.filter(item => item !== department));
      } else {
        setSelectedDepartments([...selectedDepartments, department]);
      }
    }
  };

  const resetDepartments = () => {
    setSelectedDepartments([]);
  };

  const toggleDepartmentList = () => {
    setIsDepartmentListVisible(!isDepartmentListVisible);
  };

  const handleMatch = () => {
    console.log(`선택된 학과: ${selectedDepartments}, 성별: ${selectedGender}, 카테고리: ${selectedCategory}`);
    navigation.navigate('Matching2');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>친구 찾기 매칭</Text>
        </View>

        <TouchableOpacity onPress={toggleDepartmentList} style={styles.toggleButton}>
          <Text style={styles.label}>학과 선택</Text>
          <Ionicons name={isDepartmentListVisible ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={24} color="black" />
          <TouchableOpacity onPress={resetDepartments}>
            <Ionicons name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>

        {isDepartmentListVisible && (
          <View style={styles.departmentGrid}>
            {departments.map((dept, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.departmentItem,
                  selectedDepartments.includes(dept) && styles.selectedDepartment
                ]}
                onPress={() => toggleDepartment(dept)}
              >
                <Text style={[
                  styles.departmentText, 
                  selectedDepartments.includes(dept) && styles.selectedButtonText
                ]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>성별 선택</Text>
          <View style={styles.genderRow}>
            {genders.map((gender, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.genderButton,
                  selectedGender === gender && styles.selectedGenderButton
                ]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text style={styles.genderText}>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>카테고리 선택</Text>
          <View style={styles.categoryRow}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.matchButton} onPress={handleMatch}>
          <Text style={styles.matchButtonText}>매칭하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10, // 상하 여백 추가
  },
  container: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 20, // 상하 여백 추가
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentItem: {
    width: '32%',
    height: 40,
    padding: 1,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 12, 
  },
  selectedDepartment: {
    backgroundColor: '#cce3de',
  },
  selectedDepartments: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
  },
  row: {
    marginVertical: 10,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '29%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGenderButton: {
    backgroundColor: '#cce3de',
  },
  genderText: {
    fontSize: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '17%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#cce3de',
  },
  categoryText: {
    fontSize: 16,
  },
  matchButton: {
    backgroundColor: '#88aa99',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40, // 하단 여백 추가
  },
  matchButtonText: {
    fontSize: 18,
    color: '#333',
  },
  selectedButtonText: {
    fontSize: 12,
    color: '#22333b',
  },
});

export default MatchingPage;
