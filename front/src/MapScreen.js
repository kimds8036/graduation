import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaverMapView, { Marker } from "@mj-studio/react-native-naver-map";

const NaverMapScreen = () => {
  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        center={{ 
          latitude: 37.5665,   // 서울의 위도
          longitude: 126.9780, // 서울의 경도
          zoom: 10            // 초기 줌 레벨
        }}
        zoomControl={true}     // 줌 컨트롤을 화면에 표시
      >
        <Marker
          coordinate={{ latitude: 37.5665, longitude: 126.9780 }}
          pinColor="blue"
          title="Seoul"
          description="This is a marker in Seoul"
        />
      </NaverMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default NaverMapScreen;
