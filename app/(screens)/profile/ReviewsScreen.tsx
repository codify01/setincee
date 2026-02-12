import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ReviewsScreen: React.FC = () => {
    // Dummy data for reviews, replace with actual data fetching
    const dummyReviews = [
        {
            id: 'r1',
            placeName: 'Joliol Junction',
            reviewDate: '2024-03-10',
            rating: 4.5,
            reviewText: 'Amazing authentic Nigerian cuisine! The jollof rice was perfectly spiced and the atmosphere was vibrant. Highly recommend for a taste of Lagos.',
            image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg'
        },
        {
            id: 'r2',
            placeName: 'Nike Art Gallery',
            reviewDate: '2024-03-05',
            rating: 4.8,
            reviewText: 'Incredible collection of African art. A must-visit for culture lovers! The vibrant displays and friendly staff made for a memorable experience.',
            image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg'
        },
        {
            id: 'r3',
            placeName: 'Elegushi Beach',
            reviewDate: '2024-02-20',
            rating: 4.2,
            reviewText: 'Beautiful beach with stunning views. A great spot to get unwound on weekends, though it can get a bit crowded. The local vendors offer a variety of snacks and drinks.',
            image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg'
        },
        {
            id: 'r4',
            placeName: 'La Taverna',
            reviewDate: '2024-01-15',
            rating: 4.7,
            reviewText: 'Excellent Italian food and a cozy ambiance. Perfect for a date night. The pasta dishes are a must-try!',
            image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg'
        },
    ];

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: 'My Reviews',
                    headerShadowVisible: false,
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <Text className="text-gray-500">{dummyReviews.length} reviews</Text>
                    ),
                }}
            />
            <View className='border-b border-gray-300 mt-5'/>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {dummyReviews.map((review, index) => (
                    <View key={review.id} className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
                        <View className="flex-row items-center mb-3">
                            <Image
                                source={{ uri: review.image }}
                                className="w-16 h-16 rounded-md mr-3"
                            />
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-900 text-lg">{review.placeName}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Ionicons name="star" size={16} color="#f59e0b" />
                                    <Text className="text-gray-600 text-sm ml-1">{review.rating}</Text>
                                    <Text className="text-gray-400 text-sm ml-2">|</Text>
                                    <Text className="text-gray-600 text-sm ml-2">{review.reviewDate}</Text>
                                </View>
                            </View>
                        </View>
                        <Text className="text-gray-700 text-base">{review.reviewText}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ReviewsScreen;

