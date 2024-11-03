import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopBar from './TopBar';

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
  const navigation = useNavigation();

  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetailScreen', { chat });
  };

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
        contentContainerStyle={styles.chatListContent} // FlatList의 컨텐츠 여백
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15, // SafeAreaView에 상하 여백 추가
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 20, // FlatList 하단 여백 추가
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
    marginVertical: 5, // 각 채팅 항목 간격 추가
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
