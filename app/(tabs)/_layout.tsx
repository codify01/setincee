import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#245678',
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
         headerStyle:{
            backgroundColor: '#245678',
          },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="home-filled" 
              size={24} 
              color={color}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),

          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="planet" 
              size={24} 
              color={color}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),
              headerShown: true ,
              headerTitleAlign: 'center',
        headerShadowVisible: false,       }}
      />
       <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore Locations',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="map" 
              size={24} 
              color={color}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),
              headerShown: true,
                headerTitleAlign: 'center',
        headerShadowVisible: false,
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="person" 
              size={24} 
              color={color}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),
                  headerShown: true,
         headerStyle:{
            backgroundColor: '#245678',
          },
          headerShadowVisible: false,
        }}
      />
    </Tabs>
  );
}
