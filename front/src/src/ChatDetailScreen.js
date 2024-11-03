import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import TopBar from './TopBar';

const initialMessages = [
  {
    id: '1',
    text: '9시 어때?',
    sender: 'other',
  },
];

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim().length > 0) {
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me' }]);
      setInput('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender === 'me' ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar /> 
      <View style={styles.header}>
        <Text style={styles.chatTitle}>응용화학과(여)</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }} // 리스트 하단 여백
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10, // 상하 여백 추가
  },
  header: {
    backgroundColor: '#e0e0e0',
    padding: 15, // 상하 여백 추가
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 15, // 좌우 여백 추가
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, // 좌우 여백 추가
    paddingVertical: 10, // 상하 여백 추가
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#ffd700',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    fontSize: 18,
    color: '#000',
  },
});

export default ChatDetailScreen;
