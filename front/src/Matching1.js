import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';  // useNavigation 추가

const departments = [
  '산업디자인학과', '실내디자인학과', '패션디자인학과', '시각영상디자인학과', 
  '미디어콘텐츠학과', '조형예술학과', '경영학과', '경제통상학과', 
  '경찰학과', '소방방재융합학과', '문헌정보학과', '유아교육과', 
  '사회복지학과', '메카트로닉스공학과', '컴퓨터공학과', '바이오메디컬공학과', 
  '녹색기술융합학과', '에너지신소재공학과', '간호학과', '바이오의약학과', 
  '생명공학과', '식품영양학과', '뷰티화장품학과', '스포츠건강학과', '골프산업학과', '의예과'
];

const categories = ['0', '1', '2', '3', '4'];
const genders = ['남', '여', '무관'];

const MatchingPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedGender, setSelectedGender] = useState(genders[1]);
  
  const navigation = useNavigation();  // navigation 사용

  const handleMatch = () => {
    console.log('Matching started');
    console.log(`학과: ${selectedDepartment}, 카테고리: ${selectedCategory}, 성별: ${selectedGender}`);
    
    // Matching2로 이동할 때, 선택한 값을 함께 전달
    navigation.navigate('Matching2', {
      department: selectedDepartment,
      category: selectedCategory,
      gender: selectedGender,
    });
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
          <Ionicons name="notifications-outline" size={25} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>친구 찾기 매칭</Text>

        <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
          <Ionicons name="settings-outline" size={25} color="#333" />
        </TouchableOpacity>
      </View>

      
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
        <Ionicons name="filter-outline" size={25} color="#333" style={styles.iconFilterMiddle} />
      </View>
      
      
      <View style={styles.controls}>
        <View style={styles.row}>
          <Text style={styles.label}>학과</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDepartment}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedDepartment(itemValue)}>
              {departments.map((dept, index) => (
                <Picker.Item key={index} label={dept} value={dept} />
              ))}
            </Picker>
          </View>
        </View>

        
        <View style={styles.row}>
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}>
              {categories.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        
        <View style={styles.row}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedGender}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}>
              {genders.map((gen, index) => (
                <Picker.Item key={index} label={gen} value={gen} />
              ))}
            </Picker>
          </View>
        </View>

        
        <TouchableOpacity style={styles.matchButton} onPress={handleMatch}>
          <Text style={styles.matchButtonText}>매칭하기</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => console.log('Home Pressed')} style={styles.navItem}>
          <Ionicons name="home-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Chat Pressed')} style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Map Pressed')} style={styles.navItem}>
          <Ionicons name="map-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Tracking Pressed')} style={styles.navItem}>
          <Ionicons name="save-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconFilterMiddle: {
    alignSelf: 'center',
  },
  controls: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  matchButton: {
    backgroundColor: '#BFC9D2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  matchButtonText: {
    fontSize: 18,
    color: '#333',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MatchingPage;
