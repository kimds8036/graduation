import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNotification } from './NotificationContext'; // Context를 사용하여 unreadCount 관리

const TopBar = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const { unreadCount, setUnreadCount } = useNotification(); // Context에서 unreadCount 및 setUnreadCount 사용

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const recipientId = await AsyncStorage.getItem('_id'); // 로그인된 사용자 ID 가져오기
        if (!recipientId) {
          console.error('사용자 ID가 없습니다.');
          return;
        }

        const response = await axios.get(`http://192.168.0.53:5000/api/notifications/${recipientId}`);
        const unreadNotifications = response.data.filter(notification => !notification.read).length;
        setUnreadCount(unreadNotifications); // 읽지 않은 알림 수 설정
      } catch (error) {
        console.error('알림을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchUnreadNotifications(); // 처음 로딩 시 실행
  }, [setUnreadCount]);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token'); // JWT 토큰 삭제
      await AsyncStorage.removeItem('_id'); // 사용자 _id 삭제
      Alert.alert('로그아웃', '로그아웃되었습니다.');

      setIsLoggedIn(false); // 로그아웃 상태 업데이트

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
        <Ionicons name="notifications-outline" size={24} color="black" />
        {/* 읽지 않은 알림이 있으면 빨간 배지 표시 */}
        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
      <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 5,
    height: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default TopBar;
