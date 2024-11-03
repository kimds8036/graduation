import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가
import { useNavigation } from '@react-navigation/native'; // useNavigation 추가

const MatchingFailed = () => {
  const navigation = useNavigation(); // navigation 사용

  const handleRetry = () => {
    console.log('다시 매칭하기');
    navigation.navigate('Matching2'); // Matching2로 이동
  };

  const handleCancel = () => {
    console.log('매칭 취소');
    navigation.navigate('Matching1'); // Matching1로 이동
  };

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
      <Text style={styles.title}>친구를 찾지 못했습니다.</Text>

      {/* Retry Icon */}
      <Ionicons name="refresh-circle-outline" size={60} color="#333" style={styles.centerIcon} />

      {/* Retry Text Button */}
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>다시 매칭 하기</Text>
      </TouchableOpacity>

      {/* Cancel Icon */}
      <Ionicons name="close-circle-outline" size={60} color="#333" style={styles.centerIcon} />

      {/* Cancel Text Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>매칭 취소</Text>
      </TouchableOpacity>

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
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  centerIcon: {
    alignSelf: 'center',
    marginVertical: 10, // 아이콘을 더 위로 이동시킴
  },
  retryButton: {
    backgroundColor: '#D0EBFF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#FFD6E7',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
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
  }
});

export default MatchingFailed;
