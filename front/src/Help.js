import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 추가
import RowBar from './Rowbar';

function HelpScreen() {
  const navigation = useNavigation(); // 네비게이션 훅 사용

  return (
    <SafeAreaView style={styles.safeArea}>
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
      
      <RowBar /> 
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',  // RowBar와 다른 내용 분리
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start', 
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});



export default HelpScreen;
