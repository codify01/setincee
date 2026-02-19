import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

interface TrendingCardProps {
	name: string;
	image: any;
	onPress?: () => void;
}

const TrendingCard = ({ name, image, onPress }: TrendingCardProps) => {
	return (
		<TouchableOpacity
			className="mr-4 w-60 bg-white rounded-xl overflow-hidden shadow-sm"
			onPress={onPress}
		>
			<ImageBackground
				source={{uri: image}}
				className="w-full h-72 rounded-lg"
				resizeMode="cover"
			>
				<View className="bg-white px-3 py-2 rounded-full absolute top-2 right-2 w- items-center">
					<Text className=''>Trending</Text>
				</View>
				<View className='absolute bottom-2 w-full px-3'>
					<Text className='text-white text-2xl'>{name}</Text>
					<View className='flex-row justify-between'>
						<Text className='text-lg text-white'>Ibadan</Text>
						<View className='bg-white/50 rounded-full px-3 flex justify-center items-center'>
							<Text>124</Text>
						</View>
					</View>
				</View>
			</ImageBackground>
			
		</TouchableOpacity>
	);
};

export default TrendingCard;
