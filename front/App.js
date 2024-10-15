import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './src/Homescreen';
import Matching1 from './src/Matching1';  // Matching1을 import

// 각 화면 컴포넌트
function ChatScreen() {
  return (
    <View style={styles.screen}>
      <Text>채팅 화면</Text>
    </View>
  );
}

function MapScreen() {
  return (
    <View style={styles.screen}>
      <Text>지도 화면</Text>
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

// Tab 네비게이터 생성
const Tab = createBottomTabNavigator();

// Tab 네비게이터 컴포넌트
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
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
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="SaveRoute" component={SaveRouteScreen} />
    </Tab.Navigator>
  );
}

// Stack 네비게이터 생성
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNavigator">
        {/* TabNavigator를 스택의 초기 화면으로 설정 */}
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Matching1" component={Matching1} />
      </Stack.Navigator>
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
