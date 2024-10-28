import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,ImageBackground, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MatchingRequest = ({ route, navigation }) => {
  const { userData } = route.params; // 알림에서 전달된 userData

  const handleAccept = async () => {
    try {
        const senderId = await AsyncStorage.getItem('_id'); // 로그인된 사용자 ID 가져오기

        // 매칭 요청 수락 API 호출
        await axios.put(`http://192.168.0.53:5000/api/notifications/respond-match-request`, {
            senderId,
            recipientId: userData._id, // userData에서 recipientId로 사용
            status: 'accepted'
        });

        Alert.alert('매칭 요청 수락', '매칭 요청이 수락되었습니다.');
        navigation.goBack(); // 이전 화면으로 돌아가기
    } catch (error) {
        console.error('매칭 요청 수락 오류:', error);
        Alert.alert('오류', '매칭 요청 수락에 실패했습니다.');
    }
};
const handleDecline = async () => {
  try {
      const senderId = await AsyncStorage.getItem('_id'); // 로그인된 사용자 ID 가져오기

      // 매칭 요청 거절 API 호출
      await axios.put(`http://192.168.0.53:5000/api/notifications/respond-match-request`, {
          senderId,
          recipientId: userData._id, // userData에서 recipientId로 사용
          status: 'declined'
      });

      Alert.alert('매칭 요청 거절', '매칭 요청이 거절되었습니다.');
      navigation.goBack(); // 이전 화면으로 돌아가기
  } catch (error) {
      console.error('매칭 요청 거절 오류:', error);
      Alert.alert('오류', '매칭 요청 거절에 실패했습니다.');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>매칭 요청이 왔어요!!</Text>
        <Text style={styles.subtitle}>매칭이된 사용자는 친구목록에 포함됩니다.</Text>
      </View>
  
      {/* 사용자 카드 */}
      <View style={styles.userCard}>
        <ImageBackground
          source={{ uri: userData.profileImageUrl }} // userData를 통해 프로필 이미지 URL 접근
          style={styles.userImage}
          imageStyle={styles.imageBackgroundStyle} // 이미지 스타일
        >
          <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userDepartment}>{userData.department}</Text>
          <Text style={styles.userMbti}>{userData.mbti}</Text>
          </View>
        </ImageBackground>
      </View>
    
      <TouchableOpacity style={styles.matchButton} onPress={handleAccept}>
        <Text style={styles.matchButtonText}>수락하기</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.cancelButton} onPress={handleDecline}>
        <Text style={styles.cancelButtonText}>거절하기</Text>
      </TouchableOpacity>
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center', // 전체 요소는 중앙 정렬
    backgroundColor: '#fff',
    padding: 20,
  },
  textContainer: {
    alignItems: 'flex-start', // 제목과 부제목만 좌측 정렬
    width: '100%', // 텍스트 컨테이너 너비 조정
    paddingTop:70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    marginBottom: 80,
  },
  userCard: {
    width: '60%',
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    // 그림자 효과 추가
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
    shadowOpacity: 0.3, // 그림자 투명도
    shadowRadius: 10, // 그림자 반경
    elevation: 5, // 안드로이드에서의 그림자 효과
  },
  
  userImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageBackgroundStyle: {
    borderRadius: 10,
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
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userDepartment: {
    fontSize: 14,
    marginBottom: 5,
  },
  userMbti: {
    fontSize: 14,
    marginBottom: 5,
  },
  matchButton: {
    backgroundColor: '#caf0f8',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 60,
  },
  matchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001219',
  },
  cancelButton: {
    backgroundColor: '#ffe5ec',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    height: 60,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001219',
  },
});


export default MatchingRequest;
