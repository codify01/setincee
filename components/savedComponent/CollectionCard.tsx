import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface CollectionCardProps {
    name: string;
    placesCount: number;
    isSelected: boolean;
    onPress: () => void;
    color: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ name, placesCount, isSelected, onPress, color }) => {
    return (
        <View className="mr-4 w-40">
            {/* Colored Card */}
            <TouchableOpacity
                onPress={onPress}
                className={`
                    rounded-2xl h-40 justify-between p-4
                    ${isSelected ? 'border-2 border-white' : ''}
                `}
                style={{ 
                    backgroundColor: color,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? 'white' : 'transparent'
                }}
            >
                <View className="flex-row justify-between">
                     <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-5xl font-semibold relative top-10">{placesCount}</Text>
                </View>
                    {isSelected && (
                        <View className="bg-white h-6 rounded-full">
                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                        </View>
                    )}
                </View>
                
                {/* Empty view to push the content up */}
                <View />
            </TouchableOpacity>
            
            {/* Text outside the colored card */}
            <View className="mt-2">
                <Text className="text-black  text-base ">{name}</Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    {placesCount} {placesCount === 1 ? 'place' : 'places'}
                </Text>
            </View>
        </View>
    );
};

export default CollectionCard;