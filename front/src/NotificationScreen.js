import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import { useNotification } from './NotificationContext';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Rowbar from './Rowbar';
import { useNavigation } from '@react-navigation/native';

const iconMap = {
  interest: <Icon name="heart" size={20} color="pink" />,
  message: <Icon name="envelope" size={20} color="blue" />,
  send_match_request: <Icon name="user-plus" size={20} color="purple" />,
  match_accept: <Icon name="check-circle" size={20} color="green" />,
  match_decline: <Icon name="close" size={20} color="red" />,
  post_member_join: <Icon name="users-group" size={20} color="orange" />,
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setUnreadCount } = useNotification();

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const markAllAsRead = async () => {
    try {
      const recipientId = await AsyncStorage.getItem('_id');
      if (!recipientId) {
        console.error('사용자 ID가 없습니다.');
        return;
      }

      await axios.put(`http://192.168.0.53:5000/api/notifications/mark-all-as-read/${recipientId}`);
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('모든 알림 읽음 처리 중 오류가 발생했습니다.', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const recipientId = await AsyncStorage.getItem('_id');
      if (!recipientId) {
        console.error('사용자 ObjectId가 없습니다.');
        return;
      }

      const response = await axios.get(`http://192.168.0.53:5000/api/notifications/${recipientId}`);
      setNotifications(response.data);
      const unreadCount = response.data.filter(notification => !notification.read).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('알림을 불러오는 데 실패했습니다.', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const NotificationItem = ({ notification }) => {
    const navigation = useNavigation();
    const { notificationType, message, _id } = notification;

    const handlePress = async () => {
        if (notificationType === 'send_match_request') {
            try {
                const response = await axios.get(`http://192.168.0.53:5000/api/notifications/match-request/${_id}`);
                const { status, message } = response.data;

                if (status === 'accepted' || status === 'declined') {
                    Alert.alert('이미 만료된 요청', message || '이 요청은 이미 만료되었습니다.');
                } else {
                    navigation.navigate('MatchingRequest', { userData: response.data });
                }
            } catch (error) {

                Alert.alert('오류', '이 요청은 이미 만료되었습니다.');
            }
        }
    };

    return (
        <TouchableOpacity style={styles.notificationItem} onPress={handlePress}>
            <View style={styles.iconContainer}>
                {iconMap[notificationType]}
            </View>
            <View style={styles.notificationText}>
                <Text>{message}</Text>
            </View>
        </TouchableOpacity>
    );
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <FlatList
        data={notifications}
        keyExtractor={item => item._id || Math.random().toString()}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />  
      <Rowbar />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1EEEC',
    padding: 13,
    borderRadius: 10,
    marginVertical: 1,
  },
  iconContainer: {
    width: 30, // 원하는 너비
    height: 30, // 원하는 높이
    borderRadius: 25, // 반지름을 절반으로 하여 원형으로 만들기
    backgroundColor: 'white', // 원형 배경 색상
    justifyContent: 'center', // 아이콘을 가운데로 정렬
    alignItems: 'center', // 아이콘을 가운데로 정렬
    marginRight: 10, // 아이콘과 텍스트 사이의 간격
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
  },
});

export default NotificationScreen;
