import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function HelpScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}> 
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>도움말</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          환영합니다!{'\n'}
          이 어플리케이션은 주변에서 새로운 사람들을 만나고 소셜 네트워킹을 할 수 있는 플랫폼입니다. 사용자들 간의 관심사, 취향, 위치 등을 고려하여 매칭을 제공합니다.{'\n'}
          아래는 어플리케이션의 사용법에 대한 간단한 안내입니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20, // 상하 여백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20, // 하단 여백 추가
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    padding: 20, // 여백 추가
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default HelpScreen;
