import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NearbyPreviewProps {
    placeCount: number;
    onOpenMap: () => void;
}

const NearbyPreview: React.FC<NearbyPreviewProps> = ({ placeCount, onOpenMap }) => {
    return (
        <View className="mb-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="text-xl font-bold text-gray-900">See what's nearby</Text>
                </View>
                <TouchableOpacity 
                    // onPress={onOpenMap}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-full flex-row items-center"
                >
                    <Ionicons name="map-outline" size={18} color="#3b82f6" />
                    <Text className="text-blue-500 font-medium ml-2">Open Map</Text>
                </TouchableOpacity>
            </View>

            {/* Place Count Card */}
            <TouchableOpacity 
                onPress={onOpenMap}
                className="bg-white rounded-2xl p-5 border border-gray-200"
                activeOpacity={0.9}
            >
                <View className="flex-row items-center justify-between">
                    {/* Left side: Map preview */}
                    <View className="relative mr-5">
                        <View className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                            {/* Simple map grid */}
                            <View className="absolute inset-0">
                                {/* Grid lines */}
                                <View className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-200" />
                                <View className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />
                                <View className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-200" />
                                <View className="absolute top-1/4 left-0 right-0 h-px bg-gray-200" />
                                <View className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
                                <View className="absolute top-3/4 left-0 right-0 h-px bg-gray-200" />
                            </View>
                            
                            {/* Location pin in center */}
                            <View className="relative z-10">
                                <Ionicons name="location" size={24} color="#3b82f6" />
                            </View>
                            
                            {/* Small dots around (simplified from your image) */}
                            <View className="absolute top-4 left-6 w-2 h-2 bg-blue-500 rounded-full" />
                            <View className="absolute top-6 right-5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            <View className="absolute bottom-5 left-4 w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <View className="absolute bottom-6 right-6 w-2 h-2 bg-purple-500 rounded-full" />
                        </View>
                    </View>

                    {/* Right side: Text content */}
                    <View className="flex-1">
                        {/* Place count */}
                        <View className="mb-3">
                            <Text className="text-3xl font-bold text-gray-900">{placeCount}</Text>
                            <Text className="text-lg text-gray-600">places nearby</Text>
                        </View>
                        
                        {/* Button and subtitle */}
                        <View>
                            <TouchableOpacity 
                                onPress={onOpenMap}
                                className="bg-blue-500 rounded-full py-2.5 flex-row items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold">Tap to explore on interactive map</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default NearbyPreview;