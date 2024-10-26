import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가

const MatchingSuccess = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSendRequest = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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

      {/* Success Title */}
      <Text style={styles.title}>매칭에 성공했습니다 😁</Text>
      <Text style={styles.subtitle}>동선이 89% 일치하는 친구에요!</Text>

      {/* Empty Photo Box */}
      <View style={styles.emptyPhotoBox} />

      {/* Send Request Button */}
      <TouchableOpacity style={styles.sendRequestButton} onPress={handleSendRequest}>
        <Text style={styles.sendRequestButtonText}>매칭 요청 알람 보내기</Text>
      </TouchableOpacity>

      {/* Find More Friends Button */}
      <TouchableOpacity style={styles.findMoreButton} onPress={() => console.log('다른 친구 찾기')}>
        <Text style={styles.findMoreButtonText}>다른 친구 찾기 4/5</Text>
      </TouchableOpacity>

      {/* Modal for Pop-up */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>상대에게 요청 알람을 전송하였습니다.</Text>
            <Text style={styles.modalText}>진행 상황은 알림 창을 확인해 주세요!</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
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
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  emptyPhotoBox: {
    width: 120,
    height: 150,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 30,
  },
  sendRequestButton: {
    backgroundColor: '#D0EBFF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sendRequestButtonText: {
    fontSize: 16,
    color: '#000',
  },
  findMoreButton: {
    backgroundColor: '#BFC9D2',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  findMoreButtonText: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#BFC9D2',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MatchingSuccess;
