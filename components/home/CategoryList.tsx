import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import ButtonSolid from '../buttons/ButtonSolid';

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
    <ButtonSolid title={item.name} />
  );

  return (
    <View className="mb-6">
      {/* <Text className="text-2xl font-medium mb-4">Explore by Categories</Text> */}
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
