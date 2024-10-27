import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// 네비게이션 객체가 없는 경우 기본 동작 설정
function RowBar() {
  const navigation = useNavigation() || { navigate: () => {} }; // 네비게이션이 없을 경우 빈 함수 처리
  const route = useRoute() || { name: '' }; // 라우트가 없을 경우 기본 값

  const TabButton = ({ name, label, icon }) => {
    const isActive = route.name === name; // 현재 활성화된 탭 확인
    return (
      <TouchableOpacity onPress={() => navigation.navigate(name)} style={styles.tabButton}>
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? 'tomato' : 'gray'} // 활성화된 탭이면 'tomato' 색상 적용
        />
        <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabContainer}>
      <TabButton name="Homescreen" label="Home" icon="home-outline" />
      <TabButton name="ChatScreen" label="Chat" icon="chatbubble-outline" />
      <TabButton name="MapScreen" label="Map" icon="map-outline" />
      <TabButton name="SaveRouteScreen" label="Save" icon="save-outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabButton: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
  },
  activeLabel: {
    color: 'tomato',
  },
});

export default RowBar;
