import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="home-outline" color={color} size={size} />
        )
      }}/>
      <Tab.Screen name="Search" component={SearchScreen} options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="search-outline" color={color} size={size} />
        )
      }}/>
      <Tab.Screen name="Favourite" component={FavouriteScreen} options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="ios-heart-outline" color={color} size={size} />
        )
      }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
