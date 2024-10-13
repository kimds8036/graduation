import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './src/ChatScreen';  // ChatScreen 컴포넌트
import ChatDetailScreen from './src/ChatDetailScreen'; // ChatDetailScreen 컴포넌트
import StudentCardOCR from './src/StudentCardOCR'; // StudentCardOCR 컴포넌트

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentCardOCR">
        <Stack.Screen 
          name="StudentCardOCR" 
          component={StudentCardOCR} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatDetailScreen" 
          component={ChatDetailScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
