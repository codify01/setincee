import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { router, Stack } from 'expo-router';

export default function ModalLayout() {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
        
        }}
      >
        <Stack.Screen name="CreateItinerary" />
        <Stack.Screen name="EditItinerary" />
      </Stack>
     
  );
}
