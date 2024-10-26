import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 추가

function NotificationSettingsScreen() {
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const [overallSwitch, setOverallSwitch] = useState(true);
  const [matchingSwitch, setMatchingSwitch] = useState(false);
  const [messageSwitch, setMessageSwitch] = useState(false);
  const [activitySwitch, setActivitySwitch] = useState(true);
  const [serviceSwitch, setServiceSwitch] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}> {/* SettingsScreen으로 이동 */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>푸시 알림 설정</Text>
      </View>

      {/* 전체 알림 */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>전체</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={overallSwitch ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setOverallSwitch((previousState) => !previousState)}
          value={overallSwitch}
        />
      </View>

      {/* 개별 알림 설정 */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>매칭 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={matchingSwitch ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setMatchingSwitch((previousState) => !previousState)}
          value={matchingSwitch}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>메시지 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={messageSwitch ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setMessageSwitch((previousState) => !previousState)}
          value={messageSwitch}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>활동 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={activitySwitch ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setActivitySwitch((previousState) => !previousState)}
          value={activitySwitch}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>서비스 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={serviceSwitch ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setServiceSwitch((previousState) => !previousState)}
          value={serviceSwitch}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationSettingsScreen;
