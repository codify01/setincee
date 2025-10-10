import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ScreensLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="PlaceDetailsScreen"
				options={{
					headerTitle: () => null,
					headerShadowVisible: false,
					headerLeft: () => <Ionicons name="chevron-back" size={24} />,
				}}
			/>
			<Stack.Screen
				name="UserDetails"
				options={{
					headerTitle: () => null,
					headerShadowVisible: false,
					headerLeft: () => <Ionicons name="chevron-back" size={24} />,
				}}
			/>
		</Stack>
	);
};

export default ScreensLayout;
