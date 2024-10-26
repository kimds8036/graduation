// ChatScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Navigation hook import
import TopBar from './TopBar';
import RowBar from './Rowbar';

const chatData = [
  {
    id: '1',
    name: '응용화학과(여)',
    message: '9시 어때?',
    date: 'today 16:30',
    status: 'N',
  },
  {
    id: '2',
    name: '경제통상학과(남)',
    message: '졸업 하자',
    date: '3-29',
    status: 'N',
  },
  {
    id: '3',
    name: '의료 공학과(여)',
    message: '팟 구함?',
    date: '3-27',
    status: 'N',
  },
  {
    id: '4',
    name: '신문방송학과(남)',
    message: '기름값 2000원 입금좀',
    date: '3-14',
    status: '',
  },
];

const ChatScreen = () => {
  const navigation = useNavigation(); // Navigation hook 사용

  // 채팅 아이템 클릭 시 상세 화면으로 이동
  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetailScreen', { chat }); // 선택한 채팅방 정보 전달
  };

  // 채팅 아이템 렌더링
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatDate}>{item.date}</Text>
        {item.status === 'N' && <Text style={styles.chatStatus}>N</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />
      <RowBar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chatContent: {
    flex: 3,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chatMessage: {
    color: '#555',
  },
  chatInfo: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
