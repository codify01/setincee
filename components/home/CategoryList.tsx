import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface Category {
  id: string;
  name: string;
  image: any;
}

interface Props {
  categories: Category[];
}

const CategoryList: React.FC<Props> = ({ categories }) => {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity className="mr-4 w-32 rounded-xl overflow-hidden bg-gradient-to-tr from-green-400 to-blue-500 active:opacity-80"
      onPress={() => router.push(`/(screens)/category/${item.slug}`)}>
      <Image source={{uri:item.image}} className="w-full h-24 opacity-60" resizeMode="cover" />
      <View className="absolute bottom-4 left-4">
        <Text className="text-pry font-bold text-lg">{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <Text className="text-2xl font-medium mb-4">Explore by Categories</Text>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

export default CategoryList;
