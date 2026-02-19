import React from 'react';
import { FlatList, Text, View } from 'react-native';
import TrendingCard from '@/components/cards/TrendingCard';
import { router } from 'expo-router';

interface Item {
	id: string;
	name: string;
	image: any;
}

interface Props {
	data: Item[];
}

const TrendingList: React.FC<Props> = ({ data }) => {
	return (
		<View>
			<Text className="text-2xl font-medium mb-4">Trending Now</Text>
			<FlatList
				data={data.slice().reverse()}
				horizontal
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TrendingCard
						name={item.name}
						image={item.image}
						onPress={() => router.push(`/place/${item.id}`)}
					/>
				)}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 10 }}
			/>
		</View>
	);
};

export default TrendingList;
