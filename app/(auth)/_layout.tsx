import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const _layout = () => {
	return (
		<Stack >
			<Stack.Screen
				name="index"
				options={{
                    headerTitle:()=>null,
                    headerShadowVisible:false,
                    headerLeft:()=><Ionicons name='chevron-back' size={24}/>
				}}
			/>
            	<Stack.Screen
				name="login"
				options={{
                  headerShown:false
				}}
			/>
            	<Stack.Screen
				name="interest"
				options={{
                    headerTitle:()=>null,
                    headerShadowVisible:false,
                    headerLeft:()=><Ionicons name='chevron-back' size={24}/>
				}}
			/>
		</Stack>
	);
};

export default _layout;
