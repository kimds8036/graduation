import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import GestureRecognizer from 'react-native-swipe-gestures';

function ProfileDetailScreen({ route, navigation }) {
  const { user } = route.params;
  const [overlapData, setOverlapData] = useState(null);
  const [showMap, setShowMap] = useState(false); // 지도 슬라이드 표시 상태

  useEffect(() => {
    // 일치 구간 데이터 가져오기
    const fetchOverlapData = async () => {
      try {
        const senderId = await AsyncStorage.getItem('_id');
        const response = await axios.get(`http://192.168.0.53:5000/api/tracking/get-overlapping-routes/${senderId}/${user._id}`);
        setOverlapData(response.data);
      } catch (error) {
        console.error('일치 구간 정보 가져오기 오류:', error.response ? error.response.data : error.message);
      }
    };
    fetchOverlapData();
  }, []);

  const sendInterestNotification = async (recipientId) => {
    try {
      const senderId = await AsyncStorage.getItem('_id');
      if (!senderId) throw new Error('로그인된 사용자 ID를 찾을 수 없습니다.');

      await axios.post('http://192.168.0.53:5000/api/notifications/send-interest', {
        senderId,
        recipientId,
        message: '관심을 보냈습니다!',
      });

      Alert.alert('알림 전송 성공', '관심 알림이 전송되었습니다.');
    } catch (error) {

      if (error.response && error.response.status === 400 && error.response.data.error === '이미 관심표시를 한 상대입니다!') {
        Alert.alert('이미 관심 표시를 한 상대입니다!', '같은 대상에게는 하루에 한번만 관심 알람을 보낼 수 있습니다!');
      } else {
        Alert.alert('알림 전송 실패', '관심 알림 전송에 실패했습니다.');
      }
    }
  };

  return (
    <GestureRecognizer
      onSwipeLeft={() => setShowMap(!showMap)} // 왼쪽으로 슬라이드하여 지도 보기/숨기기
      onSwipeRight={() => setShowMap(!showMap)} // 오른쪽으로 슬라이드하여 지도 보기/숨기기
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>새로운 친구를 만들어 볼까요!</Text>
          <Text style={styles.subtitle}>
            {overlapData
              ? `${overlapData.bestStart}부터 ${overlapData.bestEnd}까지 ${overlapData.intervalMatchPercentage}% 일치하는 친구에요`
              : '일치 정보를 불러오는 중...'}
          </Text>
        </View>

        {showMap ? (
  // 지도 보기
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: overlapData?.overlapCoordinates[0]?.latitude || 36.945,
            longitude: overlapData?.overlapCoordinates[0]?.longitude || 127.902,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          scrollEnabled={false} // 지도 움직임 고정
          zoomEnabled={false} // 줌 고정
        >
          {overlapData?.overlapCoordinates?.map((point, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: point.latitude, longitude: point.longitude }}
              title={`${point.time}`}
            >
              <View style={styles.customMarker} /> 
            </Marker>
          ))}
        </MapView>
) : (
  // 프로필 카드 보기
          <View style={styles.userCard}>
            <ImageBackground
              source={{ uri: user.profileImageUrl }}
              style={styles.userImage}
              imageStyle={styles.imageBackgroundStyle}
            >
              <TouchableOpacity style={styles.heartButton} onPress={() => sendInterestNotification(user._id)}>
                <Text>❤️</Text>
              </TouchableOpacity>

              <View style={styles.userInfo}>
              
                <Text style={styles.userDepartment}>{user.department}</Text>
                <Text style={styles.userMbti}>{user.mbti}</Text>
              </View>
            </ImageBackground>
          </View>
        )}

        {/* 프로필 카드와 지도를 번갈아 볼 수 있는 인디케이터 */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, !showMap && styles.activeIndicator]} />
          <View style={[styles.indicator, showMap && styles.activeIndicator]} />
        </View>
        

<TouchableOpacity
  style={styles.matchButton}
  onPress={async () => {
    try {
      const senderId = await AsyncStorage.getItem('_id');
      
      // 매칭 요청을 보낼 때 기본 요청 시도
      await axios.post('http://192.168.0.53:5000/api/notifications/send-match-request', {
        senderId,
        recipientId: user._id,
      });
      
      Alert.alert('매칭 요청이 전송되었습니다!');
    } catch (error) {
      console.error('매칭 요청 전송 오류:', error.response ? error.response.data : error.message);
      
      // 만약 거절된 사용자에 대한 요청이라면 팝업 띄우기
      if (error.response && error.response.status === 400 && error.response.data.error === '매칭거절하신 이력이 있습니다. 매칭 요청하시겠습니까?') {
        Alert.alert(
          '매칭 요청',
          '매칭거절하신 이력이 있습니다. 매칭 요청하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '요청',
              onPress: async () => {
                try {
                  // 사용자가 "요청"을 선택한 경우 overrideDeclined 옵션 추가하여 재요청
                  const senderId = await AsyncStorage.getItem('_id');
                  await axios.post('http://192.168.0.53:5000/api/notifications/send-match-request', {
                    senderId,
                    recipientId: user._id,
                    overrideDeclined: true,
                  });
                  Alert.alert('매칭 요청 성공', '매칭 요청이 성공적으로 전송되었습니다.');
                } catch (overrideError) {
                  console.error('매칭 요청 오류:', overrideError.message);
                  Alert.alert('오류', '매칭 요청을 전송하는 중 오류가 발생했습니다.');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('매칭 요청 전송 실패', error.response ? error.response.data.error : '매칭 요청 전송에 실패했습니다.');
      }
    }
  }}
>
  <Text style={styles.matchButtonText}>매칭 요청하기</Text>
</TouchableOpacity>


        {/* 취소 버튼 */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  scrollContainer: { alignItems: 'center' },
  textContainer: { alignItems: 'flex-start', width: '100%', paddingTop: 70 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'left' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'left', color: '#7D7D7D', marginBottom: 80 },
  userCard: {
    width: '60%', height: 250, backgroundColor: '#f0f0f0', borderRadius: 10, alignItems: 'center',
    justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  userImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  imageBackgroundStyle: { borderRadius: 10 },
  heartButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'white', borderRadius: 20, padding: 5 },
  userInfo: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 10, borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'flex-start'}, // 왼쪽 정렬},
  userName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  userDepartment: { fontSize: 16, marginBottom: 5 ,fontWeight: 'bold'},
  userMbti: { fontSize: 14, marginBottom: 5 },
  matchButton: {
    backgroundColor: '#caf0f8',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center', // 텍스트를 수직 가운데 정렬
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
    justifyContent: 'center', // 텍스트를 수직 가운데 정렬
    marginTop: 10,
    height: 60,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001219',
  },
  
  map: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  indicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginHorizontal: 5 },
  activeIndicator: { backgroundColor: '#000' },
  customMarker: {
    width: 10,
    height: 10,
    backgroundColor: '#6FA3EF', // 보라색 점
    borderRadius: 5,
  },
  
  
});

export default ProfileDetailScreen;
