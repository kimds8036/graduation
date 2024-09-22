// App.js
import React from 'react';
import { View, Text } from 'react-native'; // View와 Text를 올바르게 import
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './src/Homescreen';
import TopBar from './src/TopBar'; // TopBar import 확인

function ChatScreen() {
  return (
    <>
      <TopBar />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>채팅 화면</Text>
      </View>
    </>
  );
}

function MapScreen() {
  return (
    <>
      <TopBar />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>지도 화면</Text>
      </View>
    </>
  );
}

function SaveRouteScreen() {
  return (
    <>
      <TopBar />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>경로 저장 화면</Text>
      </View>
    </>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default App;
