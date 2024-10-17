import React, { useState } from 'react';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=YOUR_REST_API_KEY&redirect_uri=YOUR_REDIRECT_URI`;

export default function KakaoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [authCode, setAuthCode] = useState(null);

  const onLoginSuccess = (data) => {
    const url = data.url;
    const code = url.match(/code=([^&]+)/);

    if (code) {
      setAuthCode(code[1]);
      // 여기서 받아온 코드를 이용해 서버에서 토큰 요청을 할 수 있습니다.
      console.log("Authorization Code:", code[1]);
    }
  };

  return (
    <View style={styles.container}>
      {authCode ? (
        <View>
          <Button title="카카오톡 로그인 성공" onPress={() => console.log(authCode)} />
        </View>
      ) : (
        <WebView
          source={{ uri: KAKAO_AUTH_URL }}
          onNavigationStateChange={onLoginSuccess}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          style={styles.webview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});
