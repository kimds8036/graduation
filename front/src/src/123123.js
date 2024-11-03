import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';  // Ionicons 추가

const screenWidth = Dimensions.get('window').width;

const ResultScreen = () => {
  const data = [
    {
      name: '자연과학관',
      population: 40,
      color: '#66b2ff',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: '중앙식당',
      population: 60,
      color: '#00cc99',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
          <Ionicons name="notifications-outline" size={25} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
          <Ionicons name="settings-outline" size={25} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>목요일 동선 파악이 완료되었어요!</Text>
        <Text style={styles.subtitle}>08:21 ~ 24:00 까지의 결과에요</Text>
        <Text style={styles.description}>그래프와 함께 설명드릴게요!</Text>

        {/* Pie Chart */}
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => console.log('Home Pressed')} style={styles.navItem}>
          <Ionicons name="home-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Chat Pressed')} style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Map Pressed')} style={styles.navItem}>
          <Ionicons name="map-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Tracking Pressed')} style={styles.navItem}>
          <Ionicons name="save-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  description: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResultScreen;
