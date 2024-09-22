// src/TopBar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => alert('Notification clicked!')}>
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Settings clicked!')}>
        <Text style={styles.icon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff', // 상단 바의 배경색
  },
  icon: {
    fontSize: 24,
  },
});

export default TopBar;
