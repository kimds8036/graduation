import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

const NaverMapWithMarker = () => {
  const [location, setLocation] = useState({ latitude: 37.5665, longitude: 126.9780 }); // 기본 위치 서울

  // 네이버 지도 HTML 콘텐츠 (WebView 용)
  const getNaverMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Naver Map</title>
        <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=mcpp60denk"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map" style="width:100%;height:100%;"></div>
        <script>
          var mapOptions = {
            center: new naver.maps.LatLng(${location.latitude}, ${location.longitude}),
            zoom: 10
          };
          var map = new naver.maps.Map('map', mapOptions);

          var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(${location.latitude}, ${location.longitude}),
            map: map
          });
        </script>
      </body>
      </html>
    `;
  };

  // 지도 렌더링 (웹과 네이티브 환경 구분)
  const renderMap = () => {
    if (Platform.OS === 'web') {
      // 웹 환경에서는 iframe을 사용해 네이버 지도 표시
      return (
        <iframe
          title="Naver Map"
          src={`https://map.naver.com/v5/?c=${location.latitude},${location.longitude},10,0,0`}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } else {
      // 네이티브 환경(Expo Go)에서는 WebView 사용
      return (
        <WebView
          originWhitelist={['*']}
          source={{ html: getNaverMapHTML() }}
          style={{ flex: 1 }}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NaverMapWithMarker;
