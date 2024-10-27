import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리 사용
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 추가
import RowBar from './Rowbar'; // RowBar 추가
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가

function SettingsScreen() {
  const navigation = useNavigation(); // 네비게이션 사용

const logout = async () => {
  try {
    // 1. AsyncStorage에서 토큰 삭제
    await AsyncStorage.removeItem('jwt_token');

    // 2. 로그인 화면으로 이동 (이때 스택을 초기화해서 뒤로가기 방지)
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }], // 'Login'은 AuthStack 안에 등록된 로그인 화면
    });
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

  
  // 로그아웃 팝업 함수
  const showLogoutAlert = () => {
    Alert.alert(
      '', // 제목을 공백으로 설정 (이미지에서 제목이 없으므로)
      '접속중인 기기에서 로그아웃 하시겠습니까?', // 경고 메시지
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: logout, // 로그아웃 함수 실행
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>설정</Text>
        </View>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('ModifyProfile')}
        >
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.settingText}>프로필 수정</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('Setpushnotification')}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Text style={styles.settingText}>푸시 알림 설정</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('AccountManagement')}
        >
          <Ionicons name="key-outline" size={24} color="black" />
          <Text style={styles.settingText}>계정 관리</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('Help')}
        >
          <Ionicons name="help-circle-outline" size={24} color="black" />
          <Text style={styles.settingText}>도움말</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={showLogoutAlert}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.settingText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* RowBar 하단에 추가 */}
      <RowBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between', // RowBar와 설정 메뉴를 분리
    backgroundColor: '#fff',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // 버튼 간격 조정
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingsScreen;
