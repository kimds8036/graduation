// src/TopBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons 라이브러리 import

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => alert('Notification clicked!')}>
        <Ionicons name="notifications-outline" size={24} color="black" /> 
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Settings clicked!')}>
        <Ionicons name="settings-outline" size={24} color="black" /> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff', // 상단 바의 배경색
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10, // 상단 여백 추가
    marginBottom: 10, // 하단 여백 추가
  },
});
export default TopBar;
