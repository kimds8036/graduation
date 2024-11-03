import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import GestureRecognizer from 'react-native-swipe-gestures';

const MatchingRequest = ({ route, navigation }) => {
  const { userData } = route.params; // 알림에서 전달된 userData
  const [overlapData, setOverlapData] = useState(null);
  const [showMap, setShowMap] = useState(false); // 지도 슬라이드 표시 상태
  const [showAcceptModal, setShowAcceptModal] = useState(false); // 매칭 수락 후 모달 표시 상태

  useEffect(() => {
    const fetchOverlapData = async () => {
      try {
        const senderId = await AsyncStorage.getItem('_id');
        const response = await axios.get(`http://192.168.0.53:5000/api/tracking/get-overlapping-routes/${senderId}/${userData._id}`);
        setOverlapData(response.data);
      } catch (error) {
        console.error('일치 구간 정보 가져오기 오류:', error.response ? error.response.data : error.message);
      }
    };
    fetchOverlapData();
  }, []);

  const handleAccept = async () => {
    try {
      const senderId = await AsyncStorage.getItem('_id');
      await axios.put(`http://192.168.0.53:5000/api/notifications/respond-match-request`, {
        senderId,
        recipientId: userData._id,
        status: 'accepted'
      });
      setShowAcceptModal(true); // 매칭 수락 후 모달 표시
    } catch (error) {
      console.error('매칭 요청 수락 오류:', error);
      Alert.alert('오류', '매칭 요청 수락에 실패했습니다.');
    }
  };

  const handleDecline = async () => {
    try {
      const senderId = await AsyncStorage.getItem('_id');
      await axios.put(`http://192.168.0.53:5000/api/notifications/respond-match-request`, {
        senderId,
        recipientId: userData._id,
        status: 'declined'
      });
      Alert.alert('매칭 요청 거절', '매칭 요청이 거절되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('매칭 요청 거절 오류:', error);
      Alert.alert('오류', '매칭 요청 거절에 실패했습니다.');
    }
  };

  const handleGoToChat = () => {
    setShowAcceptModal(false);
    navigation.navigate('ChatScreen', { userData }); // 채팅 화면으로 이동
  };

  const handleGoHome = () => {
    setShowAcceptModal(false);
    navigation.navigate('Homescreen'); // 홈 화면으로 이동
  };

  return (
    <GestureRecognizer
      onSwipeLeft={() => setShowMap(!showMap)}
      onSwipeRight={() => setShowMap(!showMap)}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>매칭 요청이 왔어요!!</Text>
          <Text style={styles.subtitle}>
            {overlapData
              ? `${overlapData.bestStart}부터 ${overlapData.bestEnd}까지 ${overlapData.intervalMatchPercentage}% 일치하는 친구에요`
              : '일치 정보를 불러오는 중...'}
          </Text>
        </View>

        {showMap ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: overlapData?.overlapCoordinates[0]?.latitude || 36.945,
              longitude: overlapData?.overlapCoordinates[0]?.longitude || 127.902,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
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
          <View style={styles.userCard}>
            <ImageBackground
              source={{ uri: userData.profileImageUrl }}
              style={styles.userImage}
              imageStyle={styles.imageBackgroundStyle}
            >
              <View style={styles.userInfo}>
                <Text style={styles.userDepartment}>{userData.department}</Text>
                <Text style={styles.userMbti}>{userData.mbti}</Text>
              </View>
            </ImageBackground>
          </View>
        )}

        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, !showMap && styles.activeIndicator]} />
          <View style={[styles.indicator, showMap && styles.activeIndicator]} />
        </View>

        <TouchableOpacity style={styles.matchButton} onPress={handleAccept}>
          <Text style={styles.matchButtonText}>수락</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleDecline}>
          <Text style={styles.cancelButtonText}>거절</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 매칭 수락 후 모달 */}
      <Modal visible={showAcceptModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>매칭을 수락하셨습니다! 상대와 채팅을 하실 수 있습니다!</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleGoToChat}>
                <Text style={styles.modalButtonText}>채팅으로 이동</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleGoHome}>
                <Text style={styles.modalButtonText}>홈으로 이동</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

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
  userInfo: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 10, borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'flex-start' },
  userDepartment: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  userMbti: { fontSize: 14, marginBottom: 5 },
  matchButton: { justifyContent: 'center', backgroundColor: '#caf0f8', padding: 15, borderRadius: 30, width: '80%', alignItems: 'center', marginTop: 20, height: 60 },
  matchButtonText: { fontSize: 16, fontWeight: 'bold', color: '#001219' },
  cancelButton: { justifyContent: 'center', backgroundColor: '#ffe5ec', padding: 15, borderRadius: 30, width: '80%', alignItems: 'center', marginTop: 10, height: 60 },
  cancelButtonText: { fontSize: 16, fontWeight: 'bold', color: '#001219' },
  map: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  indicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginHorizontal: 5 },
  activeIndicator: { backgroundColor: '#000' },
  customMarker: { width: 10, height: 10, backgroundColor: '#6FA3EF', borderRadius: 5 },
  
  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { backgroundColor: '#caf0f8', padding: 10, borderRadius: 10, marginHorizontal: 10 },
  modalButtonText: { color: '#001219', fontWeight: 'bold' },
});

export default MatchingRequest;
