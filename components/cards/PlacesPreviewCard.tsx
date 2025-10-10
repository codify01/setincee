import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
	id:string
	name: string;
	description: string;
	image?: string;
}

const PlacesPreviewCard = ({ name, description, id, image }: Props) => {
	return (
		<TouchableOpacity onPress={() => router.push(`/(screens)/PlaceDetailsScreen/${id}`)}>
			<View className="flex-row justify-between items-center border border-neutral-300 mb-3 rounded-lg p-2 bg-white">
				<View className="flex-row gap-3 items-center flex-1">
					<Image
						source={{uri:image} || require('../../assets/images/splash/page1.png')}
						className="w-24 h-24 aspect-square rounded-md"
					/>
					<View className="flex-1">
						<Text className="text-xl text-pry font-semibold" numberOfLines={1} ellipsizeMode="tail">
							{name}
						</Text>
						<Text className="text-base text-neutral-500 mt-1" numberOfLines={2} ellipsizeMode="tail">
							{description}
						</Text>
					</View>
				</View>
				<Feather name="arrow-up-right" size={24} color="#245678" />
			</View>
		</TouchableOpacity>
	);
};

export default PlacesPreviewCard;
