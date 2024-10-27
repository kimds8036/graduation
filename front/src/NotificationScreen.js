import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import { useNotification } from './NotificationContext'; // Notification Context 가져오기

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setUnreadCount } = useNotification(); // Context에서 setUnreadCount 가져오기

  // 알림 메시지를 동적으로 생성하는 함수
  const generateNotificationMessage = (notificationType, senderDepartment) => {
    switch (notificationType) {
      case 'interest':
        return `관심을 보냈습니다! (학과: ${senderDepartment})`;
      case 'message':
        return `새로운 메시지가 도착했습니다. (학과: ${senderDepartment})`;
      case 'match_accept':
        return `매칭 요청을 수락했습니다! (학과: ${senderDepartment})`;
      case 'match_decline':
        return `매칭 요청을 거절했습니다. (학과: ${senderDepartment})`;
      case 'post_member_join':
        return `게시글 멤버가 결성되었습니다. (학과: ${senderDepartment})`;
      default:
        return '새로운 알림이 있습니다.';
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAllAsRead(); // 알림 읽음 처리 함수 실행
  }, []);

  const markAllAsRead = async () => {
    try {
      const recipientId = await AsyncStorage.getItem('_id');
      if (!recipientId) {
        console.error('사용자 ID가 없습니다.');
        return;
      }

      await axios.put(`http://192.168.0.53:5000/api/notifications/mark-all-as-read/${recipientId}`);

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0); // 읽지 않은 알림 수를 0으로 설정 (TopBar에 반영)
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
      setUnreadCount(unreadCount); // 읽지 않은 알림 수 업데이트
    } catch (error) {
      console.error('알림을 불러오는 데 실패했습니다.', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <FlatList
        data={notifications}
        keyExtractor={item => item._id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem}>
            <Image source={{ uri: 'https://source.unsplash.com/random/50x50?icon' }} style={styles.icon} />
            <View style={styles.notificationText}>
              <Text>{generateNotificationMessage(item.notificationType, item.senderDepartment)}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
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
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
});

export default NotificationScreen;
