import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './TopBar';
import RowBar from './Rowbar';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 채팅방 목록을 가져오는 함수
// ChatScreen.js
const fetchChatRooms = useCallback(async () => {
  try {
    const userId = await AsyncStorage.getItem('_id');
    const response = await axios.get(`http://192.168.0.53:5000/api/chat/get-chat-rooms-with-last-message/${userId}`);
    
    // 응답 데이터 수정: userName을 department에 매핑하여 학과 이름으로 사용
    const formattedData = response.data.map(room => {
      const isToday = new Date(room.date).toDateString() === new Date().toDateString();
      const formattedDate = isToday
        ? new Date(room.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(room.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
      
      return {
        ...room,
        department: room.userName, // userName을 department로 매핑
        date: formattedDate,       // 포맷된 날짜
      };
    });

    setChatRooms(formattedData);
  } catch (error) {
    console.error('채팅방 목록 가져오기 오류:', error);
  }
}, []);


  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatRooms();
    setRefreshing(false);
  };

// ChatScreen.js
const handleChatPress = (chatRoom) => {
  console.log('네비게이트 전 유저 데이터:', chatRoom); // 유저 데이터 로그 확인
  navigation.navigate('ChatDetailScreen', { userData: chatRoom });
};


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.userName}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatDate}>{item.date}</Text>
        {item.unread > 0 && <Text style={styles.chatStatus}>{item.unread}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.roomId}
        style={styles.chatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>매칭을 하여 채팅방을 개설하세요</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <RowBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  chatList: { flex: 1 },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chatContent: { flex: 3 },
  chatName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  chatMessage: { color: '#555' },
  chatInfo: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  chatDate: { fontSize: 12, color: '#888' },
  chatStatus: { fontSize: 12, color: 'red', marginTop: 5 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default ChatScreen;
