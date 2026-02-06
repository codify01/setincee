import React from 'react';
import { FlatList, Text, View } from 'react-native';
import TrendingFoodCard from '@/components/cards/TrendingFoodCard'; 

interface Item {
	id: string;
	name: string;
	cuisine: string;
	distance: string;
	rating: number;
	reviews: number;
	image: any;
}

interface Props {
	data: Item[];
}

const TrendingList: React.FC<Props> = ({ data }) => {
	console.log('====================================');
	console.log(data);
	console.log('====================================');
	return (
		<View>
			{/* <Text className="text-2xl font-medium mb-4">Trending Now</Text> */}
			<FlatList
				data={data ? data.slice().reverse() : []}
				horizontal
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TrendingFoodCard 
						name={item.name} 
						cuisine={item.cuisine}
						distance={item.distance}
						rating={item.rating}
						reviews={item.reviews}
						image={item.image} 
					/>
				)}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 10 }}
			/>
		</View>
	);
};

export default TrendingList;
