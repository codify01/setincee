import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Homeicon from '../../assets/icons/home.svg';
import Tripicon from '../../assets/icons/location.svg';
import Profileicon from '../../assets/icons/profile.svg';
import Discovericon from '../../assets/icons/discover.svg';
import SavedIcon from '../../assets/icons/save.svg'

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
            backgroundColor: '#fff',
          },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Homeicon
              size={24} 
              fill={focused ? color : 'none'}
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
        name="explore"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Discovericon 
             size={24} 
              fill={focused ? color : 'none'}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),
              headerShown: false,
              headerTitleAlign: 'center',
              headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <Tripicon 
               size={24} 
              fill={focused ? color : 'none'}
              style={{ 
                transform: [{ scale: focused ? 1.1 : 1 }] 
              }}/>),
              headerShown: true ,
              headerTitleAlign: 'center',
        headerShadowVisible: false,       }}
      />
      
       <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <SavedIcon 
             size={24} 
              fill={focused ? color : 'none'}
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
            <Profileicon
             size={24} 
              fill={focused ? color : 'none'}
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
