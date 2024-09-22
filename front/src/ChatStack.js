// src/ChatStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './ChatScreen';
import ChatDetailScreen from './ChatDetailScreen';

const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }} // 기본 화면에 상단바 숨김
      />
      <Stack.Screen
        name="ChatDetailScreen"
        component={ChatDetailScreen}
        options={{ headerShown: false }} // 상세 화면에 상단바 숨김
      />
    </Stack.Navigator>
  );
}

export default ChatStack;
