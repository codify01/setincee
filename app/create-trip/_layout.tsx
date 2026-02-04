import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ScreensLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerShadowVisible:false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown:false,
					headerTitle:()=>null,
					headerShadowVisible:false,
					headerLeft: () => <Ionicons name="chevron-back" size={24} />
				}}
			/>
			<Stack.Screen
				name="step-2"
				options={{
					headerTitle: () => null,
					headerShadowVisible: false,
					headerShown: false ,
					headerLeft: () => <Ionicons name="chevron-back" size={24} />,
				}}
			/>
            <Stack.Screen
				name="step-3"
				options={{
					headerTitle: () => null,
					headerShadowVisible: false,
					headerShown: false ,
					headerLeft: () => <Ionicons name="chevron-back" size={24} />,
				}}
			/>
		</Stack>
	);
};

export default ScreensLayout;
