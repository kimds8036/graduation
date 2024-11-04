import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TopBar from './TopBar';
import RowBar from './Rowbar';

import io from 'socket.io-client'; // Socket.IO 클라이언트 추가

const socket = io('http://192.168.0.53:5000'); // 서버 주소에 맞게 변경

socket.on('connect', () => {
  console.log('소켓 연결 성공:', socket.id); // 연결 성공 메시지
});

const ChatDetailScreen = ({ route }) => {
  const { userData } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const senderId = await AsyncStorage.getItem('_id');
        const response = await axios.get(`http://192.168.0.53:5000/api/chat/get-messages/${senderId}/${userData._id}`);
        
        // 최신 메시지가 가장 아래로 가도록 정렬
        const sortedMessages = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(sortedMessages);
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
      }
    };
    fetchMessages();
 // 서버에서 메시지를 수신하는 이벤트 리스너 설정
    socket.on('receive-message', (messageData) => {
      setMessages((prevMessages) => [messageData, ...prevMessages]);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socket.off('receive-message');
    };
  }, [userData._id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const senderId = await AsyncStorage.getItem('_id');
      const messageData = {
        senderId,
        recipientId: userData._id,
        message: newMessage,
        timestamp: new Date().toISOString() // 현재 시간을 타임스탬프로 추가
        
      };

      // 메시지를 서버에 전송
      await axios.post(`http://192.168.0.53:5000/api/chat/send-message`, messageData);
      // 소켓을 통해 다른 클라이언트에게 메시지 전송
      socket.emit('send-message', messageData);
      setMessages((prevMessages) => [messageData, ...prevMessages]); // 방금 보낸 메시지를 최상단에 추가
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };


  const renderMessageItem = ({ item }) => {
    const messageDate = new Date(item.timestamp);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();
    const formattedTime = isToday
      ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : messageDate.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
  
    return (
      <View style={[styles.messageWrapper, item.senderId === userData._id ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        {/* 상대방 메시지의 경우: 프로필 아이콘, 메시지, 시간 순서로 배치 */}
        {item.senderId !== userData._id && (
          <>
            <Image source={{ uri: userData.profileIcon }} style={styles.profileIcon} />
            <View style={[styles.messageContainer, styles.receivedMessage]}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.timestampText}>{formattedTime}</Text> 
            </View>
          </>
        )}
  
        {/* 내가 보낸 메시지의 경우: 메시지, 시간 순서로 배치 */}
        {item.senderId === userData._id && (
          <View style={[styles.messageContainer, styles.sentMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestampText}>{formattedTime}</Text> 
          </View>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.chatTitle}>{userData.department || '학과 정보 없음'}</Text>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesContainer}
          inverted // 최신 메시지를 하단에 표시
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <RowBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 10 },
  chatTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  messagesContainer: { paddingVertical: 10, flexGrow: 1 },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  myMessageWrapper: {

    justifyContent: 'flex-start', // 상대 메시지는 왼쪽 정렬 // 내 메시지는 오른쪽 정렬
  },
  otherMessageWrapper: {
    justifyContent: 'flex-end',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  messageContainer: {
    maxWidth: '70%', padding: 10, borderRadius: 10, marginHorizontal: 5,
  },
  sentMessage: { backgroundColor: '#caf0f8' }, // 내 메시지 색상 (핑크색)
  receivedMessage: { backgroundColor: '#ffe5ec' }, // 상대 메시지 색상 (파란색)
  messageText: { fontSize: 16 },
  timestampText: {
    fontSize: 10,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd',
  },
  input: { flex: 1, padding: 10, backgroundColor: '#f1f1f1', borderRadius: 10 },
  sendButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 10, marginLeft: 5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatDetailScreen;
