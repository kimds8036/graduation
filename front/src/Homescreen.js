import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import TopBar from './TopBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Rowbar from './Rowbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

function UserCard({ user, matchedUsers }) {
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
    if (matchedUsers.includes(user._id)) {
      Alert.alert('이미 매칭된 사용자입니다!', '이미 매칭된 사용자에게는 관심을 보낼 수 없습니다.');
      return;
    }

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
      if (error.response && error.response.status === 400 && error.response.data.error === '이미 관심표시를 한 상대입니다!') {
        Alert.alert('이미 관심 표시를 한 상대입니다!', '같은 대상에게는 하루에 한번만 관심 알람을 보낼 수 있습니다!');
      } else {
        Alert.alert('알림 전송 실패', '관심 알림 전송에 실패했습니다.');
      }
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
  const [matchedUsers, setMatchedUsers] = useState([]); // 매칭된 사용자 목록
  const [rejectedUsers, setRejectedUsers] = useState([]); // 거절된 사용자 목록
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    fetchMatchedUsers();
    fetchRejectedUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [matchedUsers, rejectedUsers]);

  const [topPost, setTopPost] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.0.53:5000/api/writepost')
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

  // 거절된 사용자 목록 가져오기
  const fetchRejectedUsers = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('_id');
      const response = await axios.get(`http://192.168.0.53:5000/api/rejected-users/${currentUserId}`);
      setRejectedUsers(response.data.rejectedUserIds || []);
    } catch (error) {
      console.error('거절된 사용자 데이터를 가져오는 중 오류:', error);
    }
  };

  const fetchMatchedUsers = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('_id');
      const response = await axios.get(`http://192.168.0.53:5000/api/matches/${currentUserId}`);
      setMatchedUsers(response.data.matchedUserIds || []);
    } catch (error) {
      console.error('매칭된 사용자 데이터를 가져오는 중 오류:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('_id');
      const response = await axios.get('http://192.168.0.53:5000/api/users/users');
      
      // 현재 사용자, 매칭된 사용자, 거절된 사용자를 제외한 사용자 필터링
      const filteredUsers = response.data.filter(
        user => user._id !== currentUserId && 
                !matchedUsers.includes(user._id) && 
                !rejectedUsers.includes(user._id)
      );

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
              <UserCard key={index} user={user} matchedUsers={matchedUsers} />
            ))}
          </ScrollView>
        </View>
  
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
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/graduate-aee1b.appspot.com/o/profileImages%2Fback1.jpg?alt=media&token=94cf2077-2107-416d-ab71-600e453af5a5' }}
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
  sectionWithMarginTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 30,
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
    height: 70,
    position: 'relative',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'flex-start', // 왼쪽 정렬
  },
  userDepartment: {
    fontWeight: 'bold',
    fontSize: 14,
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
  cardSlider: {
    paddingHorizontal: 1, // 카드 좌우 여백을 설정하여 화면 중앙에 위치
    marginTop: 20,
  },
  activityCard: {
    width: screenWidth * 0.9, // 화면 너비의 85%로 설정하여 좌우 여백 확보
    height: 250, // 카드 높이 설정
    alignSelf: 'center', // 카드 중앙 정렬
    marginHorizontal: 10, // 카드 간격 설정
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
});

export default Homescreen;
