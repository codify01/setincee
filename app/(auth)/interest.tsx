import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const interest = () => {
	return (
		<View className="flex-1 container px-4">
			<View className="flex-[9]">
				<View>
					<Text className="text-2xl text-pry font-semibold">
						Select Interest
					</Text>
					<Text className="text-grey">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
						eiusmod
					</Text>
				</View>
				<View></View>
			</View>
			<View className="flex-[1]">
				<TouchableOpacity className="btn bg-pry" >
					<Text className="text-white text-center font-medium">Next</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default interest;
