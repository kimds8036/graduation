import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from './TopBar';
import RowBar from './Rowbar';

// 게시글 더미 데이터
const initialPosts = [
  { id: 1, title: '목요일 정모', content: '충주에서 같이 모일 사람?', gender: '여', time: '14:20', votes: 2, maxVotes: 5, userVoted: false },
  { id: 2, title: '모임 준비', content: '택시 같이 타실 분?', gender: '무관', time: '13:50', votes: 3, maxVotes: 5, userVoted: false },
  { id: 3, title: '충주역에서 건대가실분', content: '구해요', gender: '여', time: '13:50', votes: 1, maxVotes: 4, userVoted: false },
  { id: 4, title: '충주 모임 택시', content: '충주역에서 타실분?', gender: '남', time: '12:00', votes: 0, maxVotes: 4, userVoted: false },
  // 추가 게시글
];

export default function BoardScreen() {
    const [posts, setPosts] = useState(initialPosts);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation(); // 네비게이션 사용

  // 투표 처리 함수
  const handleVote = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        if (post.userVoted) {
          return { ...post, votes: post.votes - 1, userVoted: false };
        } else {
          return { ...post, votes: post.votes + 1, userVoted: true };
        }
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  // 새로고침 함수
  const fetchPosts = () => {
    setRefreshing(true);
    // 여기에 API 호출 등을 넣어 새 데이터를 가져옴
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // 예시로 1초 후 새로고침 종료
  };

  // 게시글 렌더링


// 투표 버튼 부분 수정
const renderPostItem = ({ item }) => (
  <View style={styles.postItem}>
    <View style={styles.postDetails}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text>{item.gender} | {item.time}</Text>
    </View>
    <TouchableOpacity
      style={[
        styles.voteButton,
        item.userVoted ? styles.votedButton : styles.unvotedButton // 버튼 스타일 구분
      ]}
      onPress={() => handleVote(item.id)}
    >
      <Ionicons
        name={item.userVoted ? 'thumbs-up' : 'thumbs-up-outline'} // 아이콘 구분
        size={20}
        color={item.userVoted ? 'blue' : 'gray'} // 투표 여부에 따라 색상 구분
      />
      <Text style={styles.voteCount}>{item.votes}/{item.maxVotes}</Text>
    </TouchableOpacity>
  </View>
);



  
return (
    <SafeAreaView style={styles.container}>
      <TopBar/>
      {/* 검색과 글쓰기 버튼 */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="검색" style={styles.searchInput} />
        
        {/* 글쓰기 버튼 */}
        <TouchableOpacity 
          style={styles.writeButton}
          onPress={() => navigation.navigate('Writepostscreen')}  // 'WritePostScreen'으로 이동
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* 게시글 리스트 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPostItem}
        refreshing={refreshing}
        onRefresh={fetchPosts}  // 새로고침 기능
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <RowBar/>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  writeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  postItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postDetails: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    color: '#555',
    marginVertical: 5,
  },
  voteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row', // 아이콘과 텍스트를 나란히 배치
  },
  votedButton: {
    backgroundColor: '#e0f7fa', // 투표한 경우 배경 색
  },
  unvotedButton: {
    backgroundColor: '#e0e0e0', // 투표하지 않은 경우 배경 색
  },
  voteCount: {
    marginLeft: 5, // 아이콘과 숫자 사이 간격
    fontSize: 16,
    color: '#333',
  },
});
