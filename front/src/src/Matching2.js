import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가
import { useNavigation, StackActions } from '@react-navigation/native';  // navigation 추가, StackActions 추가

const MatchingInProgress = () => {
  const navigation = useNavigation(); // navigation 훅 사용

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(StackActions.replace('Matchingfailurescreen')); // 30초 후 MatchingFailureScreen으로 이동
    }, 10000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigation]);

  const handleCancel = () => {
    console.log('매칭 취소');
    navigation.navigate('Matching1'); // 매칭 취소 시 Matching1로 이동
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
      <Text style={styles.title}>친구 찾기 매칭</Text>

      {/* ActivityIndicator for Buffering */}
      <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />

      {/* Matching Text */}
      <Text style={styles.matchingText}>매칭중...</Text>

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>취소</Text>
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
  spinner: {
    alignSelf: 'center',
    marginVertical: 30,
  },
  matchingText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#BFC9D2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
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

export default MatchingInProgress;
