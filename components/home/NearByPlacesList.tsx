import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

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
    <TouchableOpacity className="mr-4 w-48 bg-white overflow-hidden active:opacity-80">
     <View className='rounded-2xl overflow-hidden'>
       <ImageBackground source={item.image} className="w-full h-52 " >
        <View className='bg-white w-16 h-8 rounded-full top-2 right-2 absolute flex-row items-center justify-center gap-1 px-2'>
          <Ionicons name='star'/>
          <Text>4.8</Text>
        </View>
         <View className='rounded-full bottom-2 left-0 absolute flex-row items-center justify-center gap-1 px-2'>
          <Ionicons name='location-outline' color={'white'} size={20}/>
          <Text className='text-white text-xl'>4.8 km</Text>
        </View>
      </ImageBackground>
     </View>
      <View className="p-2">
        <Text className="text-lg font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.distance} away</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <Text className="text-2xl font-medium mb-4">Popular Near You</Text>
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
