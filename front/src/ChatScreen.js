import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, RefreshControl, Image} from 'react-native';
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
    const token = await AsyncStorage.getItem('authToken'); // 인증 토큰 가져오기

    const response = await axios.get(
      `http://192.168.0.53:5000/api/chat/get-chat-rooms-with-last-message/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰을 요청 헤더에 추가
        },
      }
    );

    // 응답 데이터 수정: userName을 학과 이름으로, 날짜 포맷 수정
    const formattedData = response.data.map((room) => {
      const isToday = new Date(room.date).toDateString() === new Date().toDateString();
      const formattedDate = isToday
        ? new Date(room.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(room.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
      
      return {
        ...room,
        userName: room.userName, // 학과 이름으로 표시
        date: formattedDate,     // 포맷된 날짜
        profileImageUrl: room.profileImageUrl, // 프로필 이미지 URL 포함
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
      {/* 프로필 이미지 */}
      <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
      
      {/* 학과와 최근 메시지 */}
      <View style={styles.textContainer}>
        <Text style={styles.chatName}>{item.userName}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
    </View>

    {/* 날짜와 읽지 않은 메시지 표시 */}
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
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center', // 이미지와 텍스트를 수직 가운데 정렬
    flex: 1,              // 텍스트가 공간을 차지할 수 있도록 확장
  },
  profileImage: {
    width: 50,           // 이미지 너비
    height: 50,          // 이미지 높이
    borderRadius: 25,    // 원형으로 만들기
    marginRight: 10,     // 이미지와 텍스트 간 간격
  },
  textContainer: {
    justifyContent: 'center', // 텍스트를 수직으로 가운데 정렬
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: '#555', // 메시지 색상 설정
    marginTop: 2,  // 학과와 메시지 사이에 약간의 간격
  },
  chatInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center', // 높이 가운데 정렬
  },
  chatDate: {
    fontSize: 12,
    color: '#888',
  },
  chatStatus: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});

export default ChatScreen;
