import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리 사용
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 추가

function SettingsScreen() {
  const navigation = useNavigation(); // 네비게이션 사용

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
          onPress: () => console.log('로그아웃 완료'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      {/* 프로필 수정 */}
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={() => navigation.navigate('ModifyProfile')}
      >
        <Ionicons name="person-outline" size={24} color="black" />
        <Text style={styles.settingText}>프로필 수정</Text>
      </TouchableOpacity>

      {/* 푸시 알림 설정 */}
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={() => navigation.navigate('Setpushnotification')}
      >
        <Ionicons name="notifications-outline" size={24} color="black" />
        <Text style={styles.settingText}>푸시 알림 설정</Text>
      </TouchableOpacity>

      {/* 계정 관리 */}
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={() => navigation.navigate('AccountManagement')}
      >
        <Ionicons name="key-outline" size={24} color="black" />
        <Text style={styles.settingText}>계정 관리</Text>
      </TouchableOpacity>

      {/* 도움말 */}
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={() => navigation.navigate('Help')}
      >
        <Ionicons name="help-circle-outline" size={24} color="black" />
        <Text style={styles.settingText}>도움말</Text>
      </TouchableOpacity>

      {/* 로그아웃 */}
      <TouchableOpacity style={styles.settingItem} onPress={showLogoutAlert}>
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text style={styles.settingText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20, // 상하 여백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20, // 헤더 아래로 조금씩 내림
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
    paddingVertical: 20, // 각 항목 아래로 조금씩 내림
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingsScreen;
