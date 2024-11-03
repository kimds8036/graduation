// src/Rowbar.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './Homescreen';
import ChatStack from './ChatStack';
import MapScreen from './MapScreen';
import SaveRouteScreen from './SaveRouteScreen';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function Rowbar() {
  // 각 컴포넌트가 제대로 불러와졌는지 확인
  if (!Homescreen || !ChatStack || !MapScreen || !SaveRouteScreen) {
    console.error("One or more components are undefined. Please check imports.");
    return null; // 컴포넌트가 undefined인 경우 빈 화면 반환
  }

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
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="SaveRoute" component={SaveRouteScreen} />
    </Tab.Navigator>
  );
}

export default Rowbar;
