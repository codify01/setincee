import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { 
    id: '1', 
    name: 'Nature', 
    slug: 'nature',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
  },
  { 
    id: '2', 
    name: 'Cities', 
    slug: 'cities',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg",
  },
  { 
    id: '3', 
    name: 'Culture', 
    slug: 'culture',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135824/samples/people/jazz.jpg",
  },
  { 
    id: '4', 
    name: 'Adventure', 
    slug: 'adventure',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/landscapes/beach-boat.jpg",
  },
];

const CategoryScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-6">
      
      {/* Header */}
      <Text className="text-2xl font-semibold text-pry">Categories</Text>
      <Text className="text-grey mt-1">Explore and discover what interests you.</Text>

      {/* Category Grid */}
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5">
        <View className="flex-row flex-wrap justify-between">
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] mb-4"
              onPress={() => {}}
            >
              <View className="w-full h-32 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full object-cover"
                />
              </View>
              <Text className="text-center mt-2 text-base font-medium text-gray-800">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default CategoryScreen;
