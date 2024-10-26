import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 가져오기
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from './src/Homescreen';
import Matching1 from './src/Matching1.js';
import Matching2 from './src/Matching2.js';
import LoginScreen from './src/LoginScreen';
import SignupScreen from './src/SignupScreen';
import NotificationScreen from './src/NotificationScreen';
import StudentInfoScreen from './src/StudentInfoScreen';
import RowBar from './src/Rowbar'; // RowBar 컴포넌트 가져오기
import ChatScreen from './src/ChatScreen'; // Chat 화면 추가
import MapScreen from './src/MapScreen'; // Map 화면 추가
import SaveRouteScreen from './src/SaveRouteScreen'; // SaveRoute 화면 추가
import { NotificationProvider } from './src/NotificationContext'; // 추가




const Stack = createStackNavigator();


// HomeStack: Home 관련 스택
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homescreen" component={Homescreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SaveRouteScreen" component={SaveRouteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// AuthStack: 로그인 및 회원가입 화면 관리
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="StudentInfo" component={StudentInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAutoLogin = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      setIsLoggedIn(!!token);
    };
    checkAutoLogin();
  }, []);

  return (
    <NotificationProvider>
      <NavigationContainer>
        {isLoggedIn ? <HomeStack /> : <AuthStack />}
      </NavigationContainer>
    </NotificationProvider>
  );
}

export default App;