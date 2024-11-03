import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import TopBar from './TopBar';
import { useNavigation } from '@react-navigation/native';
import Rowbar from './Rowbar';
import axios from 'axios';

const users = [
  {
    name: '컴퓨터 공학과',
    gender: '남',
    mbti: 'INFP',
    match: '79%',
    image: 'https://source.unsplash.com/random/200x200?person1',
  },
  {
    name: '유아교육학',
    gender: '여',
    mbti: 'ESTP',
    match: '63%',
    image: 'https://source.unsplash.com/random/200x200?person2',
  },
  {
    name: '경찰행정학과',
    gender: '여',
    mbti: 'ESFJ',
    match: '54%',
    image: 'https://source.unsplash.com/random/200x200?person3',
  },
];

function Homescreen() {
  const navigation = useNavigation();
  const [topPost, setTopPost] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.24.108:5000/api/writepost')
      .then(response => {
        if (response.data && response.data.length > 0) {
          const sortedPosts = response.data.sort((a, b) => b.recommendations - a.recommendations);
          setTopPost(sortedPosts[0]);
        }
      })
      .catch(error => {
        console.error('게시글 가져오기 오류:', error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>동선이 비슷한 친구들이에요</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Matching1')}>
            <Text style={styles.moreText}>더보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userContainer}>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Image source={{ uri: user.image }} style={styles.userImage} />
              <TouchableOpacity style={styles.heartButton}>
                <Text>❤️</Text>
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text>{user.gender} | {user.mbti}</Text>
                <Text>{user.match}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>함께 할 친구를 찾고있어요</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VoteBoardScreen')}>
            <Text style={styles.moreText}>더보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        {topPost && (
          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => navigation.navigate('PostDetailScreen', { post: topPost })}
          >
            <Image
              source={{ uri: 'https://source.unsplash.com/random/400x200?activity' }}
              style={styles.activityImage}
            />
            <View style={styles.overlay} />
            <View style={styles.activityInfo}>
              <View style={styles.textContainer}>
                <Text style={styles.activityTitle}>{topPost.title}</Text>
                <Text style={styles.activityDetails}>
                  {topPost.gender} | {topPost.startTime} - {topPost.endTime} | 현재 인원: {topPost.currentParticipants} / {topPost.numberOfPeople}
                </Text>
              </View>
              <TouchableOpacity style={styles.likeButton}>
                <Text>👍 {topPost.recommendations}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20, // SafeAreaView에 상하 여백 추가
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20, // 컨테이너에 상하 여백 추가
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreText: {
    color: '#007AFF',
  },
  userContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  userImage: {
    width: '100%',
    height: 100,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
  },
  userInfo: {
    padding: 8,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activityCard: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e8e8e8',
    position: 'relative',
  },
  activityImage: {
    width: '100%',
    height: 150,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  activityInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  activityDetails: {
    color: '#666',
    marginTop: 4,
  },
  likeButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Homescreen;
