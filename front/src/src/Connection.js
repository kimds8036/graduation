import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가

const NewFriendScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
          <Ionicons name="notifications-outline" size={25} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
          <Ionicons name="settings-outline" size={25} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>새로운 친구가 생겼군요! 😊</Text>
      <Text style={styles.subtitle}>친구와는 위치공유와 채팅이 가능해요!</Text>

      {/* Empty Profile Boxes */}
      <View style={styles.profileContainer}>
        <View style={styles.emptyPhotoBox} />
        <View style={styles.connectionLine} />
        <View style={styles.emptyPhotoBox} />
      </View>

      {/* Chat Button */}
      <TouchableOpacity style={styles.chatButton} onPress={() => console.log('채팅하기')}>
        <Text style={styles.chatButtonText}>채팅하기</Text>
      </TouchableOpacity>

      {/* Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={() => console.log('위치 보기')}>
        <Text style={styles.locationButtonText}>위치 보기</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => console.log('Home Pressed')} style={styles.navItem}>
          <Ionicons name="home-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Chat Pressed')} style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Map Pressed')} style={styles.navItem}>
          <Ionicons name="map-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Tracking Pressed')} style={styles.navItem}>
          <Ionicons name="save-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40, // 상단 헤더의 패딩을 더 크게 설정하여 아이콘을 아래로 내립니다.
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyPhotoBox: {
    width: 120,
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  connectionLine: {
    width: 40,
    height: 2,
    backgroundColor: '#000',
  },
  chatButton: {
    backgroundColor: '#D0EBFF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  chatButtonText: {
    fontSize: 16,
    color: '#000',
  },
  locationButton: {
    backgroundColor: '#BFC9D2',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    color: '#000',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default NewFriendScreen;
