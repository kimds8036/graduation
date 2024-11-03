import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import TopBar from './TopBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function VoteBoardScreen() {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.24.108:5000/api/writepost')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('게시글 가져오기 오류:', error);
      });
  }, []);

  const handleRecommend = (id) => {
    const isRecommended = recommendedPosts.includes(id);
    axios.post(`http://192.168.24.108:5000/api/writepost/${id}/recommend`, {
      isRecommending: !isRecommended
    })
      .then(response => {
        setRecommendedPosts(isRecommended ? recommendedPosts.filter(postId => postId !== id) : [...recommendedPosts, id]);
        setPosts(posts.map(post => post._id === id ? response.data : post));

        Alert.alert(isRecommended ? '추천 취소되었습니다.' : '추천되었습니다!', '', [{ text: '확인' }]);
      })
      .catch(error => {
        console.error('추천 처리 중 오류:', error.response ? error.response.data : error.message);
      });
  };

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
        onPress={() => navigation.navigate('WritePostScreen')}
      >
        <Text>✏️ 글쓰기</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PostDetailScreen', { post: item })}
          >
            <View style={styles.post}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postDetails}>
                <Text style={styles.postTime}>
                  {item.startTime} - {item.endTime}
                </Text>
                <View style={styles.recommendSection}>
                  <Text style={styles.postRecommendations}>
                    추천 수: {item.recommendations}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRecommend(item._id)}
                    style={styles.voteButton}
                  >
                    <Text>{recommendedPosts.includes(item._id) ? '추천 취소' : '추천'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20, // 상하 여백 추가
  },
  searchInput: {
    margin: 15, // 검색 입력 상자 여백
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  writeButton: {
    margin: 15, // 글쓰기 버튼 여백
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  post: {
    padding: 20, // 게시글 상하 여백 조정
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTime: {
    fontSize: 14,
    color: '#888',
  },
  recommendSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postRecommendations: {
    fontSize: 14,
    color: '#555',
    marginRight: 8,
  },
  voteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});
