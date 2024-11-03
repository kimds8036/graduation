import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';

export default function PostDetailScreen({ route }) {
  const { post } = route.params; // 이전 화면에서 전달된 게시글 데이터
  const [currentParticipants, setCurrentParticipants] = useState(post.currentParticipants || 0);

  // 참여하기 버튼 클릭 시 현재 인원 증가
  const handleJoin = () => {
    if (currentParticipants >= post.numberOfPeople) {
      Alert.alert("참여 불가", "모집 인원이 모두 찼습니다.");
      return;
    }

    axios.patch(`http://192.168.24.108:5000/api/writepost/${post._id}/join`)
      .then(response => {
        setCurrentParticipants(response.data.currentParticipants);
        Alert.alert("참여 완료", "참여가 완료되었습니다.");
      })
      .catch(error => {
        console.error('참여 중 오류 발생:', error);
        Alert.alert("오류", "참여하는 중 오류가 발생했습니다.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* 제목 */}
        <Text style={styles.title}>제목 : {post.title}</Text>
        
        {/* 실선 구분선 */}
        <View style={styles.separator} />
        
        {/* 시간, 모집 인원, 추천 수 */}
        <View style={styles.infoContainer}>
          <Text style={styles.time}>{post.startTime} - {post.endTime}</Text>
          <Text style={styles.numberOfPeople}>모집 인원: {post.numberOfPeople}명 구해요</Text>
          <Text style={styles.recommendations}>추천 수: {post.recommendations}</Text>
        </View>
        
        {/* 실선 구분선 */}
        <View style={styles.separator} />
        
        {/* 내용 */}
        <Text style={styles.content}>{post.content}</Text>
      </View>

      {/* 현재 인원과 참여하기 버튼 - 화면 하단에 고정 */}
      <View style={styles.joinContainer}>
        <Text style={styles.currentParticipants}>현재 인원: {currentParticipants} / {post.numberOfPeople}</Text>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinButtonText}>참여하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  numberOfPeople: {
    fontSize: 14,
    color: '#666',
  },
  recommendations: {
    fontSize: 14,
    color: '#555',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },
  joinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  currentParticipants: {
    fontSize: 16,
    color: '#333',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
