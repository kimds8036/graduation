import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import TopBar from './TopBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Rowbar from './Rowbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UserCard({ user }) {
  const [matchPercentage, setMatchPercentage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMatchPercentage = async () => {
      try {
        const user1Id = await AsyncStorage.getItem('_id');
        const response = await axios.get(`http://192.168.0.53:5000/api/tracking/compare-routes/${user1Id}/${user._id}`);
        if (response.status === 200 && response.data.matchPercentage >= 2) {
          setMatchPercentage(response.data.matchPercentage);
        }
      } catch (error) {
        console.error('Error fetching match percentage:', error);
      }
    };

    fetchMatchPercentage();
  }, [user._id]);

  const sendInterestNotification = async () => {
    try {
      const senderId = await AsyncStorage.getItem('_id');
      await axios.post('http://192.168.0.53:5000/api/notifications/send-interest', {
        senderId,
        recipientId: user._id,
        message: '관심을 보냈습니다!',
      });
      Alert.alert('알림 전송 성공', '관심 알림이 전송되었습니다.');
    } catch (error) {
      console.error('알림 전송 오류:', error.response ? error.response.data : error.message);
      Alert.alert('알림 전송 실패', '관심 알림 전송에 실패했습니다.');
    }
  };

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileDetailScreen', { user })}>
      <View style={styles.userCard}>
        <ImageBackground
          source={{ uri: user.profileImageUrl }}
          style={styles.userImage}
          imageStyle={styles.imageBackgroundStyle}
        >
          <TouchableOpacity
            style={styles.heartButton}
            onPress={sendInterestNotification}
          >
            <Text>❤️</Text>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userDepartment}>{user.department}</Text>
            <Text style={styles.userMbti}>{user.mbti}</Text>
            <View style={styles.userFooter}>
              <Text style={styles.matchPercentage}>{matchPercentage ? `${matchPercentage}%` : '계산중...'}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

function Homescreen() {
  const [randomUsers, setRandomUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUsers = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('_id');
      const response = await axios.get('http://192.168.0.53:5000/api/users/users');
      const filteredUsers = response.data.filter(user => user._id !== currentUserId);

      if (filteredUsers.length < 4) {
        setRandomUsers(filteredUsers);
      } else {
        const randomSelection = filteredUsers.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRandomUsers(randomSelection);
      }
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
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

        <View style={styles.userContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {randomUsers.map((user, index) => (
              <UserCard key={index} user={user} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>함께 할 친구를 찾고있어요</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BoardScreen')}>
            <Text style={styles.moreText}>더보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <Image
            source={{ uri: 'https://source.unsplash.com/random/400x200?activity' }}
            style={styles.activityImage}
          />
          <View style={styles.overlay} />
          <View style={styles.activityInfo}>
            <View style={styles.textContainer}>
              <Text style={styles.activityTitle}>단원동 혼밥 탈출</Text>
              <Text style={styles.activityDetails}>성별 무관 / 학과 무관 / 19:00</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
              <Text>👍 17</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Rowbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreText: {
    color: '#007AFF',
  },
  userContainer: {
    padding: 1,
  },
  userCard: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageBackgroundStyle: {
    borderRadius: 15,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  userInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    height: 50,
    position: 'relative',
    justifyContent: 'space-between',
  },
  userDepartment: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  userMbti: {
    fontSize: 12,
    fontWeight: '300',
  },
  userFooter: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginLeft: 'auto',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -5 }],
    minWidth: 10,
    minHeight: 10,
    justifyContent: 'center',
  },
  matchPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
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
  userFooter: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginLeft: 'auto', // 오른쪽 끝으로 이동
    alignItems: 'center',
    position: 'absolute', // 절대 위치로 설정
    right: 5, // 오른쪽 끝에 배치
    top: '50%', // 수직 가운데에 위치
    transform: [{ translateY: -5 }], // 중앙에 정확히 배치하기 위해 약간 위로 이동
    minWidth: 10, // 최소 너비 설정
    minHeight: 10, // 최소 높이 설정
    justifyContent: 'center', // 텍스트 가운데 정렬
  
  },
  matchPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default Homescreen;
