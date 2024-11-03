import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function AccountManagementScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}> 
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계정 관리</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            value="12345@kku.ac.kr"
            editable={false}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value="김태희"
            editable={false}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>학과</Text>
          <TextInput
            style={styles.input}
            value="국어국문학과"
            editable={false}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>성별</Text>
          <TextInput
            style={styles.input}
            value="여자"
            editable={false}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>학번</Text>
          <TextInput
            style={styles.input}
            value="08학번"
            editable={false}
          />
        </View>
      </View>

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
    paddingVertical: 20, // 상하 여백 추가
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
    marginBottom: 30, // 하단 여백 추가
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // 각 행 간격을 넓게
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
    marginTop: 20, // 상단 여백 추가
  },
});

export default AccountManagementScreen;
