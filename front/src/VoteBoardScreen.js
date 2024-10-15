import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import TopBar from './TopBar'; // TopBar 컴포넌트 가져오기
import Rowbar from './Rowbar'; // Rowbar 컴포넌트 가져오기

// 게시글 데이터 예시
const posts = [
  { id: 1, title: '목요일 정문 -> 충주상공회의소', time: '여 14:20', participants: '2/5' },
  { id: 2, title: '지금 충주역에서 건대가실 분', time: '여 13:50', participants: '3/5' },
  { id: 3, title: '지금 충대 모시래 택시', time: '여 12:00', participants: '1/4' },
  { id: 4, title: '9시 충주약학교 택시 타실분', time: '여 11:00', participants: '1/2' },
  { id: 5, title: '10시에 충주역에서', time: '여 09:30', participants: '1/6' },
];

export default function VoteBoardScreen({ navigation }) {
  const [votedPosts, setVotedPosts] = useState([]); // 투표 여부를 저장하는 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 투표 버튼 핸들러
  const handleVote = (id) => {
    const isVoted = votedPosts.includes(id);
    if (isVoted) {
      setVotedPosts(votedPosts.filter(postId => postId !== id)); // 투표 취소
      Alert.alert('참여 취소되었습니다.', '', [{ text: '확인' }]);
    } else {
      setVotedPosts([...votedPosts, id]); // 투표 참여
      Alert.alert('참여 투표 하였습니다!', '', [{ text: '확인' }]);
    }
  };

  // 검색 필터링
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <TopBar />

      
      <TextInput
        placeholder="게시글 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => navigation.navigate('PostWrite')}
      >
        <Text>✏️ 글쓰기</Text>
      </TouchableOpacity>

      
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postTime}>{item.time}</Text>
            <Text style={styles.postParticipants}>{item.participants}</Text>
            <TouchableOpacity
              onPress={() => handleVote(item.id)}
              style={styles.voteButton}
            >
              <Text>{votedPosts.includes(item.id) ? '참여 취소' : '참여'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      
      <Rowbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  writeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  post: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 14,
    color: '#888',
  },
  postParticipants: {
    fontSize: 14,
    color: '#555',
  },
  voteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});
