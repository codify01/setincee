import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	FlatList,
	ListRenderItem,
	TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlacesPreviewCard from '@/components/cards/PlacesPreviewCard';
import { getAllPlaces } from '@/utils/axiosIntances';
import { router } from 'expo-router';

const categories: string[] = ['places', 'restaurants', 'hotels', 'gardens', 'parks'];

const Explore: React.FC = () => {
	const [places, setPlaces] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPlaces = async () => {
			setLoading(true);
			try {
				const response = await getAllPlaces();
				if (response && response.data && Array.isArray(response.data.data)) {
					setPlaces(response.data.data);
				}
			} catch (error) {
				console.error('Error fetching places:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPlaces();
	}, []);

	const renderCategoryItem: ListRenderItem<string> = ({ item }) => (
		<View className="capitalize bg-pry px-5 py-2 rounded-lg mr-2">
			<Text className="text-white">{item}</Text>
		</View>
	);

	const renderResultItem = ({ item }) => (
		<PlacesPreviewCard id={item._id} name={item.name} description={item.address} image={item.images[0]} />
	);

	return (
		<View className="flex-1 flex-col gap-3 bg-sec px-5 py-3">
			{/* Search Bar */}
			<View className="flex-row justify-between mb-4">
				<View className="bg-white border border-neutral-300 w-full flex-row gap-3 items-center p-3 rounded-lg">
					<Ionicons name="search" size={24} color="black" />
					<TextInput
						placeholder="Search places, events"
						className="w-full"
					/>
				</View>
			</View>

			{/* Categories */}
			{/* <FlatList
				data={categories}
				renderItem={renderCategoryItem}
				horizontal
				keyExtractor={(item, index) => `${item}-${index}`}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 10 }}
			/> */}

			{/* Search Results */}
			<FlatList
				data={places}
				renderItem={renderResultItem}
				keyExtractor={(item, index) => index.toString()}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 80 }}
			/>

			{/* Suggest a Place Button */}
			<TouchableOpacity
				className="bg-pry py-4 rounded-full w-16 h-16 items-center justify-center absolute bottom-5 right-5"
				onPress={() => router.push('/(modals)/SuggestionBox')}
			>
				<Ionicons name="add" size={25} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

export default Explore;
