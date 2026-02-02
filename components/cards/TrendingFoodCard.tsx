import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TrendingCardProps {
    name: string;
    cuisine: string;
    distance: string;
    rating: number;
    reviews: number;
    image: any;
    width?: string | number; // Added for different widths
    showDetails?: boolean; // Added to control what to show
    variant?: 'default' | 'compact' | 'detailed'; // Added for different styles
}

const TrendingCard = ({ 
    name, 
    cuisine, 
    distance, 
    rating, 
    reviews, 
    image,
    width = 'w-96', // Default width
    showDetails = true, // Default to showing details
    variant = 'default' // Default variant
}: TrendingCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    
    // Determine style based on variant
    const getVariantStyle = () => {
        switch (variant) {
            case 'compact':
                return {
                    container: `${width} mr-4 bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-300`,
                    imageHeight: 'h-48',
                    showLocation: false,
                    showSecondaryRating: false
                };
            case 'detailed':
                return {
                    container: `${width} mr-4 bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-300`,
                    imageHeight: 'h-72',
                    showLocation: true,
                    showSecondaryRating: true,
                    showDescription: true
                };
            default: // 'default'
                return {
                    container: `${width} mr-4 bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-300`,
                    imageHeight: 'h-64',
                    showLocation: true,
                    showSecondaryRating: true,
                    showDescription: false
                };
        }
    };
    
    const variantStyle = getVariantStyle();

    return (
        <TouchableOpacity className={variantStyle.container}>
            <ImageBackground
                source={{ uri: image }}
                className={`w-full ${variantStyle.imageHeight}`}
                resizeMode="cover"
            >
                {/* Gradient overlay for better text visibility */}
                <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Trending Badge */}
                <View className="flex-row justify-between items-start p-3">
                    <View className="bg-[#ff6900] px-3 py-1.5 rounded-full flex-row items-center">
                        <Ionicons name="trending-up" size={18} color="#fff" />
                        <Text className="text-white font-base text-sm ml-1">Trending</Text>
                    </View>
                    
                    {/* Favorite/Bookmark Button */}
                    <TouchableOpacity 
                        className="bg-white/90 p-2 rounded-full"
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Ionicons 
                            name={isFavorite ? "bookmark" : "bookmark-outline"} 
                            size={20} 
                            color={isFavorite ? "#3b82f6" : "#6b7280"} 
                        />
                    </TouchableOpacity>
                </View>
                
                {/* Restaurant Info Overlay */}
                <View className="absolute bottom-4 left-4 right-4">
                    <View className="flex-row justify-between items-end">
                        <View className="flex-1">
                            <Text className="text-white text-xl font-bold">{name}</Text>
                            <Text className="text-gray-200 text-sm mb-2">{cuisine}</Text>
                        </View>
                        
                        {variantStyle.showLocation && (
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={16} color="#d1d5db" />
                                <Text className="text-gray-200 text-sm ml-1">{distance}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ImageBackground>
            
            {/* Bottom Content Section - Conditionally render based on showDetails */}
            {showDetails && (
                <View className="p-4">
                    {variantStyle.showDescription && (
                        <Text className="text-gray-700 text-sm mb-2">Elegant Beach & Beachside</Text>
                    )}
                    
                    {/* Rating Section */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={18} color="#f59e0b" />
                                <Text className="text-gray-900 font-bold text-lg ml-2">{rating}</Text>
                                <Text className="text-gray-500 text-sm ml-2">({reviews} reviews)</Text>
                            </View>
                        </View>
                        
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default TrendingCard;