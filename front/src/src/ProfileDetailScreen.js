import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


function ProfileDetailScreen({ route, navigation }) {
  // 전달된 사용자 데이터 가져오기
  const { user } = route.params;


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
        
        // 이미 관심 표시를 한 상대의 경우
        if (error.response && error.response.status === 400 && error.response.data.error === '이미 관심표시를 한 상대입니다!') {
            Alert.alert(
                '이미 관심 표시를 한 상대입니다!',
                '같은 대상에게는 하루에 한번만 관심 알람을 보낼 수 있습니다!'
            );
        } else {
            Alert.alert('알림 전송 실패', '관심 알림 전송에 실패했습니다.');
        }
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
      <Text style={styles.title}>새로운 친구를 만들어 볼까요!</Text>
      <Text style={styles.subtitle}>상대에게 매칭 알람이 가요!!</Text>
      </View>
      {/* 사용자 카드 */}
      <View style={styles.userCard}>
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
            {/* <Text style={styles.userGender}>{user.gender}</Text>  주석 처리 */} 
            <Text style={styles.userMbti}>{user.mbti}</Text>
            {/* <Text style={styles.userMatchPercentage}>{user.matchPercentage}%</Text> 주석 처리 */} 
          </View>
        </ImageBackground>
      </View>

      {/* 매칭 요청 버튼 */}
      <TouchableOpacity
          style={styles.matchButton}
          onPress={async () => {
            try {
              const senderId = await AsyncStorage.getItem('_id'); // 로그인된 사용자 _id 가져오기
              const recipientId = user._id; // 프로필 화면에서 전달받은 수신자 ID

              const response = await axios.post('http://192.168.0.53:5000/api/notifications/send-match-request', {
                senderId,
                recipientId,
              });

              Alert.alert('매칭 요청이 전송되었습니다!');
            } catch (error) {
              console.error('매칭 요청 전송 오류:', error.response ? error.response.data : error.message);
              Alert.alert('매칭 요청 전송 실패', error.response ? error.response.data.error : '매칭 요청 전송에 실패했습니다.');
            }
          }}
        >
          <Text style={styles.matchButtonText}>매칭 요청하기</Text>
        </TouchableOpacity>


      {/* 취소 버튼 */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()} // 홈 화면으로 돌아가기
      >
        <Text style={styles.cancelButtonText}>취소</Text>
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

export default ProfileDetailScreen;
