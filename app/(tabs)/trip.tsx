import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AiIcon from '../../assets/icons/ai.svg';
import { router } from 'expo-router';
import TripsSkeleton from '@/components/skeletons/TripsSkeleton';
import { useTripsTabData } from '@/hooks/useTripsTabData';

interface Trip {
    id: string;
    name: string;
    destination: string;
    duration: string;
    travelers: number;
    image: string;
}

const styles = StyleSheet.create({
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, 
    },
});

//  const mockTrips: Trip[] = [
//     {
//         id: '1',
//         name: 'Summer Vacation',
//         destination: 'Cape Town, South Africa',
//         duration: '15 Days',
//         travelers: 1,
//         image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
//     },
//     {
//         id: '2',
//         name: 'Winter Getaway',
//         destination: 'New York City, USA',
//         duration: '7 Days',
//         travelers: 2,
//         image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
//     },
// ];

const Trips: React.FC = () => {
    const { data, loading, refreshing, refresh } = useTripsTabData();
    // console.log('Trips data:', data);
    
    const trips: Trip[] = Array.isArray(data?.trips) && data.trips.length > 0 ? data.trips : []; // Use mock data if API data is not available
    const hasTrips = trips.length > 0; 

   

    const renderTripCard = ({ item }: { item: Trip }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100"
            onPress={() => router.push(`/trip/${item.id}`)} 
        >
            <Image source={{ uri: item.image }} className="w-full h-40" resizeMode="cover" />
            <View className="p-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-bold text-gray-900">{item.name}</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-600 text-base mb-1">{item.destination}</Text>
                <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-1">{item.duration}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-1">{item.travelers} traveler{item.travelers > 1 ? 's' : ''}</Text>
                    </View>
                </View>
                <View className='flex-row justify-between mt-4 items-center border-t border-gray-300 pt-3'>
                <Text className='font-thin text-gray-900'>
                    {(item.placesCount ?? 0)} {(item.placesCount ?? 0) === 1 ? 'place added' : 'places added'}
                </Text>
                <TouchableOpacity 
                    className=" py-2 px-4 rounded-full items-center"
                    onPress={() => router.push(`/trip/${item.id}`)}
                >
                    <Text className="text-blue-600 font-base">View Details </Text>
                </TouchableOpacity>
                </View>

            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <TripsSkeleton />;
    }

    if (hasTrips) {
        return (
            <View className="flex-1 pt-12 px-5">
                {/* Header */}
                <View className="mb-8 border-b border-gray-200 pb-4 pt-10">
                    <Text className="text-4xl text-gray-900">My Trips</Text>
                    <Text className="text-gray-500 text-base">Plan and organize your adventures</Text>
                </View>

                {/* Trips List */}
                <FlatList
                    data={trips}
                    renderItem={renderTripCard}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                    }
                />

                {/* Floating Action Button */}
                <TouchableOpacity
                    className="absolute bottom-8 right-5 w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg"
                    onPress={() => router.push('/create-trip')} // Assuming a route for creating a trip
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
            >
                {/* Header */}
                <View className="mb-8 border-b border-gray-200 pb-4 pt-10">
                    <Text className="text-4xl text-gray-900">My Trips</Text>
                    <Text className="text-gray-500 text-base">Plan and organize your adventures</Text>
                </View>

                {/* Empty State Content */}
                <View className="flex-1 justify-center items-center px-4 -mt-20">
                    <View className="w-32 h-32 rounded-full bg-blue-100 items-center justify-center mb-6">
                        <Ionicons name="map-outline" size={60} color="#3b82f6" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 text-center mb-2">No trips yet</Text>
                    <Text className="text-gray-500 text-base text-center mb-8 px-4">
                        Start planning your perfect itinerary and add places you want to visit.
                    </Text>

                    {/* Create Your First Trip Button */}
                    <TouchableOpacity 
                        className="w-full h-14 bg-blue-600 rounded-full flex-row items-center justify-center mb-4"
                        onPress={() => router.push('/create-trip')} // Assuming a route for creating a trip
                    >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text className="text-white text-lg font-semibold ml-2">Create Your First Trip</Text>
                    </TouchableOpacity>

                    {/* Try AI Assistant Button */}
                    <TouchableOpacity onPress={() => router.push('/bot/botchat')} className="w-full h-14 rounded-full overflow-hidden">
                        <LinearGradient
                            colors={['#9810FA', '#155DFC']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <AiIcon width={24} height={20} />
                            <Text className="text-white text-lg font-semibold ml-2">Try AI Assistant</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
};

export default Trips;
