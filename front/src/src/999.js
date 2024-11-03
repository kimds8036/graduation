import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가

const screenWidth = Dimensions.get('window').width;

const ResultScreen = () => {
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
      <Text style={styles.title}>목요일 동선 파악이 완료되었어요!</Text>
      <Text style={styles.subtitle}>08:21 ~ 24:00 까지의 결과에요</Text>

      {/* Empty Map Placeholder */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>지도를 여기에 표시할 수 있습니다.</Text>
      </View>

      {/* Save/ Delete Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => console.log('동선 저장')}>
          <Text style={styles.buttonText}>금일 동선 저장하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('동선 삭제')}>
          <Text style={styles.buttonText}>금일 동선 삭제하기</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#f9f9f9',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  placeholder: {
    width: screenWidth - 40,
    height: 300,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#D0EBFF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#BFC9D2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResultScreen;
