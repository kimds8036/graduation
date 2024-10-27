import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function ProfileDetailScreen({ route, navigation }) {
  // 전달된 사용자 데이터 가져오기
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 친구를 만들어 볼까요!</Text>
      <Text style={styles.subtitle}>상대에게 매칭 알람이 가요!!</Text>

      {/* 사용자 카드 */}
      <View style={styles.userCard}>
        <Image source={{ uri: user.profileImageUrl }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text>{user.department}</Text>
          <Text>{user.gender}</Text>
          <Text>{user.mbti}</Text>
          <Text>{user.matchPercentage}%</Text>
        </View>
      </View>

      {/* 매칭 요청 버튼 */}
      <TouchableOpacity
        style={styles.matchButton}
        onPress={() => {
          alert('매칭 요청이 전송되었습니다!');
          navigation.goBack();
        }}
      >
        <Text style={styles.matchButtonText}>매칭 요청하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  userCard: {
    width: 200,
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 30,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userInfo: {
    alignItems: 'center',
  },
  matchButton: {
    backgroundColor: '#b3e5fc',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  matchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileDetailScreen;
