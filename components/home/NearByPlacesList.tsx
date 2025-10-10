import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface NearbyPlace {
  id: string;
  name: string;
  distance: string;
  image: any;
}

interface Props {
  data: NearbyPlace[];
}

const NearbyPlacesList: React.FC<Props> = ({ data }) => {
  const renderItem = ({ item }: { item: NearbyPlace }) => (
    <TouchableOpacity className="mr-4 w-48 bg-white rounded-xl overflow-hidden border border-neutral-300 active:opacity-80">
      <Image source={item.image} className="w-full h-24" resizeMode="cover" />
      <View className="p-2">
        <Text className="text-lg font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.distance} away</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <Text className="text-2xl font-medium mb-4">Nearby Places</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

export default NearbyPlacesList;
