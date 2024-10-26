import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons 불러오기

const OneOneOne = () => {
  const handlePress = () => {
    console.log("동선 추적하기 버튼 클릭됨");
  };

  return (
    <View style={styles.container}>
      {/* Main text at the top */}
      <Text style={styles.title}>나의 활동 반경을 알아볼까요?</Text>
      <Text style={styles.subtitle}>위치 정보 이용 동의를 해주세요!</Text>

      {/* 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>동선 추적하기</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingBottom: 60, // Adjust to leave space for the navigation bar
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#829375',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default OneOneOne;
