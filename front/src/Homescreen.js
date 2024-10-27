import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, RefreshControl } from 'react-native';
import TopBar from './TopBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Rowbar from './Rowbar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 올바른 경로에서 가져오기
import FastImage from 'react-native-fast-image';



function Homescreen() {
  const [users, setUsers] = useState([]); // 전체 사용자 데이터
  const [randomUsers, setRandomUsers] = useState([]); // 랜덤으로 선택된 사용자
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 관리
  const navigation = useNavigation();

  // API에서 사용자 데이터를 가져오는 함수
  const fetchUsers = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('_id'); // 로그인한 사용자 ID 가져오기
      const response = await axios.get('http://192.168.0.53:5000/api/users/users');
      console.log('API Response:', response.data);
      const filteredUsers = response.data.filter(user => user._id !== currentUserId); // 자신 제외
      if (filteredUsers.length < 4) {
        setRandomUsers(filteredUsers); // 사용자가 4명보다 적으면 모두 표시
      } else {
        const randomSelection = filteredUsers.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRandomUsers(randomSelection); // 무작위로 4명 선택
      }
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류:', error);
    }
  };

  // 새로고침 핸들러
  const onRefresh = async () => {
    setRefreshing(true); // 새로고침 시작
  
    try {
      await fetchUsers(); // 사용자 데이터를 다시 가져옴
      
      // 새로고침을 조금 더 길게 유지하여 로딩이 완료되도록 함
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 대기 (시간을 조정할 수 있음)
      
    } catch (error) {
      console.error("새로고침 중 오류:", error);
    } finally {
      setRefreshing(false); // 새로고침 상태를 종료
    }
  };
  // 컴포넌트가 처음 마운트될 때 사용자 데이터를 가져옴
  useEffect(() => {
    fetchUsers(); // 컴포넌트 마운트 시 데이터 로드
  }, []); // 빈 배열로 한 번만 실행

  const sendInterestNotification = async (recipientId) => {
    try {
      const senderId = await AsyncStorage.getItem('_id'); // 로그인된 사용자 _id 가져오기

      if (!senderId) {
        throw new Error('로그인된 사용자 ID를 찾을 수 없습니다.');
      }

      // 알림 전송 API 호출 (발신자의 학과 정보는 백엔드에서 가져옴)
      await axios.post('http://192.168.0.53:5000/api/notifications/send-interest', {
        senderId,    // 발신자 _id만 보냄
        recipientId, // 수신자 _id
        message: '관심을 보냈습니다!',
      });

      Alert.alert('알림 전송 성공', '관심 알림이 전송되었습니다.');
    } catch (error) {
      console.error('알림 전송 오류:', error.response ? error.response.data : error.message);
      Alert.alert('알림 전송 실패', '관심 알림 전송에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // 새로고침 기능 추가
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>동선이 비슷한 친구들이에요</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Matching1')}>
            <Text style={styles.moreText}>더보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {randomUsers.map((user, index) => (
      <View key={index} style={styles.userCard}>
        {/** 로그 추가: 각 사용자의 프로필 이미지 URL 출력 */}
        {console.log(`User ${index} profileImageUrl:`, user.profileImageUrl)}

        <ImageBackground
          source={{ uri: user.profileImageUrl }}
          style={styles.userImage}
          imageStyle={styles.imageBackgroundStyle}  // 이미지 스타일
        >
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => sendInterestNotification(user._id)}
          >
            <Text>❤️</Text>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text> 
            <Text style={styles.userDepartment}>{user.department}</Text> 
            <Text style={styles.userMbti}>{user.mbti}</Text> 
          </View>
        </ImageBackground>
      </View>
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
    overflow: 'hidden', // 카드 안에서 이미지와 텍스트가 넘치지 않도록 설정
    backgroundColor: '#f0f0f0', // 카드의 기본 배경색
  },
  userImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // 이미지 하단에 정보가 표시되도록 설정
  },
  imageBackgroundStyle: {
    borderRadius: 15, // 이미지에 둥근 모서리 적용
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 투명한 흰색 배경
    padding: 10,
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    
    marginBottom: 2, // 아래에 여백 추가
  },
  userDepartment: {
    fontSize: 14,
    
    marginBottom: 2, // 아래에 여백 추가
  },
  userMbti: {
    fontSize: 14,
    
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
