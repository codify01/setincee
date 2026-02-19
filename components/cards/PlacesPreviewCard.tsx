import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
    id: string;
    name: string;
    description: string;
    image?: string;
    collections?: string[]; // Add collections prop
    onPress?: () => void; // Add optional onPress prop
}

const PlacesPreviewCard = ({ name, description, id, image, collections, onPress }: Props) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            // Default navigation to place details
            router.push(`/place/${id}`);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View className="flex-row justify-between items-center border border-neutral-300 mb-3 rounded-lg  p-3 bg-white">
                <View className="flex-row gap-3 items-center flex-1">
                    <Image
                        source={{ uri: image } || require('../../assets/images/splash/page1.png')}
                        className="w-24 h-24 aspect-square rounded-md"
                    />
                    <View className="flex-1">
                        <Text className="text-xl text-pry font-semibold" numberOfLines={1} ellipsizeMode="tail">
                            {name}
                        </Text>
                        <Text className="text-base text-neutral-500 mt-1" numberOfLines={2} ellipsizeMode="tail">
                            {description}
                        </Text>
                        {collections && collections.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {collections.map((collection: string) => (
                                    <View 
                                        key={collection} 
                                        className="flex-row items-center rounded-full px-3 py-1 bg-blue-50 mr-2 mb-2"
                                    >
                                        <Ionicons name="bookmark-outline" size={12} color="#3b82f6" />
                                        <Text className="text-blue-600 text-xs ml-1">{collection}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                <Feather name="arrow-up-right" size={24} color="#245678" />
            </View>
        </TouchableOpacity>
    );
};

export default PlacesPreviewCard;
