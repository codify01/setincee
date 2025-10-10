import { View, Text, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';


interface TrendingCardProps {
    name: string;
    image: any; // Adjust type as needed, e.g., ImageSourcePropType
}

const TrendingCard = ({ name, image }:TrendingCardProps) => {
	return (
		<View className="mr-4 w-60 bg-white rounded-xl overflow-hidden shadow-sm">
			<Image
				source={{uri: image}}
				className="w-full h-44 rounded-lg"
				resizeMode="cover"
			/>
			<View className="p-3">
				<Text className="text-xl font-medium">{name}</Text>
				<Text className="text-base">
					Late-night local shopping vibe with street food.”
				</Text>
				<View className="flex-row gap-3">
					<Text className="font-medium text-base">Trending</Text>
					<Text className="font-medium text-base">4.7</Text>
					<Text className="font-medium text-base">1.2 km</Text>
				</View>
			</View>
			<Link href={'/(screens)/CategoryScreen'} className="py-3 text-center border-t border-t-pry/30 text-pry">
				View More
			</Link>
		</View>
	);
};

export default TrendingCard;
