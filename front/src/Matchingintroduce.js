import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가

const MatchingSuccess = () => {
  const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
  const [isRejectModalVisible, setRejectModalVisible] = useState(false);

  const handleSendRequest = () => {
    setAcceptModalVisible(true);
  };

  const handleRejectRequest = () => {
    setRejectModalVisible(true);
  };

  const handleCloseAcceptModal = () => {
    setAcceptModalVisible(false);
  };

  const handleCloseRejectModal = () => {
    setRejectModalVisible(false);
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
      <Text style={styles.title}>새로운 친구가 생길수있는 기회에요!🤗</Text>
      <Text style={styles.subtitle}>프로필 카드를 확인후 결정할수있어요!</Text>

      {/* Empty Photo Box */}
      <View style={styles.emptyPhotoBox} />

      {/* Send Request Button */}
      <TouchableOpacity style={styles.sendRequestButton} onPress={handleSendRequest}>
        <Text style={styles.sendRequestButtonText}>매칭 수락하기</Text>
      </TouchableOpacity>

      {/* Reject Button */}
      <TouchableOpacity style={styles.findMoreButton} onPress={handleRejectRequest}>
        <Text style={styles.findMoreButtonText}>거절하기</Text>
      </TouchableOpacity>

      {/* Modal for Accept Request Pop-up */}
      <Modal
        transparent={true}
        visible={isAcceptModalVisible}
        animationType="fade"
        onRequestClose={handleCloseAcceptModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>상대에게 요청 알람을 전송하였습니다.</Text>
            <Text style={styles.modalText}>진행 상황은 알림 창을 확인해 주세요!</Text>
            <TouchableOpacity onPress={handleCloseAcceptModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Reject Request Pop-up */}
      <Modal
        transparent={true}
        visible={isRejectModalVisible}
        animationType="fade"
        onRequestClose={handleCloseRejectModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>매칭을 거절하였습니다!</Text>
            <TouchableOpacity onPress={handleCloseRejectModal} style={styles.closeButton}>
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
