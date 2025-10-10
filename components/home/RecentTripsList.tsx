import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface Trip {
  id: string;
  name: string;
  date: string;
  image: any;
}

interface Props {
  trips: Trip[];
}

const RecentTripList: React.FC<Props> = ({ trips }) => {
  const renderItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity className="mr-4 w-48 rounded-xl overflow-hidden bg-white border border-gray-200 active:opacity-80">
      <Image source={item.image} className="w-full h-24" resizeMode="cover" />
      <View className="p-2">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text className="text-sm text-gray-500">Date: {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <Text className="text-2xl font-medium mb-4">Recent Trips</Text>
      <FlatList
        data={trips}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

export default RecentTripList;
