// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './src/ChatScreen';
import ChatDetailScreen from './src/ChatDetailScreen';
import Rowbar from './src/Rowbar'; // Rowbar import

const Stack = createStackNavigator();

// Chat Stack Navigator
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

function App() {
  return (
    <NavigationContainer>
      <Rowbar />
    </NavigationContainer>
  );
}

export default App;
