import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const SplashScreenLayout = () => {
  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="(auth)"
            options={{
            headerShown: false,
            }}
        />
    </Stack>
  )
}

export default SplashScreenLayout