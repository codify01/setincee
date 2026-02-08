import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface Props {
  places: {
    _id: string;
    name: string;
    description: string;
    rating?: number;
    images: string[];
  }[];
}

const RecommendedList: React.FC<Props> = ({ places }) => {
  const renderItem = ({ item }: { item: Props['places'][number] }) => (
    <TouchableOpacity className="mr-4 w-56 rounded-xl bg-white p-3 border border-gray-200 active:opacity-80"
      onPress={() => router.push(`/place/${item._id}`)}>
      <Image
        source={item.images?.[0] ? { uri: item.images[0] } : require('@/assets/images/splash/page1.png')}
        className="w-full h-32 rounded-xl mb-3"
        resizeMode="cover"
      />
      <Text className="font-semibold text-lg text-gray-800 line-clamp-1">{item.name}</Text>
      <Text className="text-yellow-500 font-semibold mb-1">⭐ {item.rating || 4.5} </Text>
      <Text className="text-grey text-sm line-clamp-2">{item.description}</Text>
    </TouchableOpacity>
  );

  return (
<View>
    <Text className="text-2xl font-medium mb-4">Recommended Places</Text>
      <FlatList
      data={places}
      horizontal
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
</View>
  );
};

export default RecommendedList;
