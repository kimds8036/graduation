import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TopBar from './TopBar'; // TopBar 컴포넌트를 import합니다.
import RowBar from './Rowbar'; // RowBar 컴포넌트를 import합니다.

const ChatDetailScreen = ({ route }) => {
  const { userData } = route.params || {}; // 기본 값 설정
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // 초기 메시지 로드
    const fetchMessages = async () => {
      try {
        const senderId = await AsyncStorage.getItem('_id');
        const response = await axios.get(`http://192.168.0.53:5000/api/chat/get-messages/${senderId}/${userData._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const senderId = await AsyncStorage.getItem('_id');
      const response = await axios.post(`http://192.168.0.53:5000/api/chat/send-message`, {
        senderId,
        recipientId: userData._id,
        message: newMessage,
      });
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === userData._id ? styles.receivedMessage : styles.sentMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container}>
        <Text style={styles.chatTitle}>{userData.department} - {userData.mbti}</Text>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesContainer}
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
      </ScrollView>
      <RowBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 10 },
  chatTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  messagesContainer: { paddingVertical: 10 },
  messageContainer: {
    maxWidth: '80%', padding: 10, borderRadius: 10, marginVertical: 5,
  },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#caf0f8' },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#ffe5ec' },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd',
  },
  input: { flex: 1, padding: 10, backgroundColor: '#f1f1f1', borderRadius: 10 },
  sendButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 10, marginLeft: 5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatDetailScreen;
