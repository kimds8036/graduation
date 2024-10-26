import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 추가

function AccountManagementScreen() {
  const navigation = useNavigation(); // 네비게이션 훅 사용

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}> {/* SettingsScreen으로 이동 */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계정 관리</Text>
      </View>

      {/* 계정 정보 */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            value="12345@kku.ac.kr"
            editable={false} // 읽기 전용 필드
          />
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value="김태희"
            editable={false} // 읽기 전용 필드
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>학과</Text>
          <TextInput
            style={styles.input}
            value="국어국문학과"
            editable={false} // 읽기 전용 필드
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>성별</Text>
          <TextInput
            style={styles.input}
            value="여자"
            editable={false} // 읽기 전용 필드
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>학번</Text>
          <TextInput
            style={styles.input}
            value="08학번"
            editable={false} // 읽기 전용 필드
          />
        </View>
      </View>

      {/* 정보 수정 링크 */}
      <TouchableOpacity>
        <Text style={styles.editLink}>정보 수정이 필요하신가요?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    fontSize: 16,
    color: '#333',
  },
  editLink: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
  },
});

export default AccountManagementScreen;
