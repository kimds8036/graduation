import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons 불러오기

const OneOneOne = () => {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const handlePress = () => {
    if (timer > 0) {
      ToastAndroid.showWithGravity(
        "동선 추적 중입니다.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } else {
      ToastAndroid.showWithGravity(
        "동선 추적을 시작합니다!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );

      // 타이머 시작
      setTimer(20);
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>나의 활동 반경을 알아볼까요?</Text>
      <Text style={styles.subtitle}>현재 시간부터 15시간 동안 자동으로 추적됩니다!</Text>
      <Text style={styles.subtitle}>15시간 후에는 자동으로 저장 됩니다.</Text>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>동선 추적하기</Text>
      </TouchableOpacity>

      {timer > 0 && (
        <Text style={styles.timerText}>동선 추적 완료까지 {timer}초 남음</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingBottom: 60, // Adjust to leave space for the navigation bar
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#829375',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#ff0000',
    marginTop: 20,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default OneOneOne;
