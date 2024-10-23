import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './src/Homescreen';
import Matching1 from './src/Matching1.js';  // Matching1을 import
import BoardScreen from './src/Boardscreen.js';  // BoardScreen import
import WritePostScreen from './src/Writepostscreen.js';  // WritePostScreen import
import MapScreen from './src/MapScreen.js';  // MapScreen import
import LoginScreen from './src/LoginScreen';  // LoginScreen import
import SignupScreen from './src/SignupScreen';  // SignupScreen import
import StudentInfoScreen from './src/StudentInfoScreen';  // StudentInfoScreen import

// 각 화면 컴포넌트
function ChatScreen() {
  return (
    <View style={styles.screen}>
      <Text>채팅 화면</Text>
    </View>
  );
}

function SaveRouteScreen() {
  return (
    <View style={styles.screen}>
      <Text>경로 저장 화면</Text>
    </View>
  );
}

// Stack 네비게이터 생성
const Stack = createStackNavigator();

// HomeStack을 생성해 Homescreen과 Matching1, BoardScreen, WritePostScreen을 관리
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homescreen} options={{ headerShown: false }} />
      <Stack.Screen name="Matching1" component={Matching1} options={{ headerShown: false }} />
      <Stack.Screen name="Boardscreen" component={BoardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WritePostScreen" component={WritePostScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Tab 네비게이터 생성
const Tab = createBottomTabNavigator();

// Tab 네비게이터 컴포넌트
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = 'chatbubble-outline';
          } else if (route.name === 'Map') {
            iconName = 'map-outline';
          } else if (route.name === 'SaveRoute') {
            iconName = 'save-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="SaveRoute" component={SaveRouteScreen} />
    </Tab.Navigator>
  );
}

// AuthStack: 로그인, 회원가입, StudentInfoScreen 화면 관리
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      {/* StudentInfoScreen을 추가 */}
      <Stack.Screen name="StudentInfoScreen" component={StudentInfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 자동 로그인 시도
    const checkAutoLogin = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkAutoLogin();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <TabNavigator /> : <AuthStack />}  
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
