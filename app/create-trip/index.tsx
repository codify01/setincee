import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCities } from '@/utils/axiosIntances';

const tripTypes = [
    { name: 'Family', icon: 'people-outline' },
    { name: 'Romantic', icon: 'heart-outline' },
    { name: 'Adventure', icon: 'compass-outline' },
    { name: 'Relaxing', icon: 'leaf-outline' },
    { name: 'Friends', icon: 'happy-outline' },
    { name: 'Work', icon: 'briefcase-outline' },
];

interface CityItem {
    _id: string;
    name: string;
}

const CreateTrip: React.FC = () => {
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
    const [isDestinationFocused, setIsDestinationFocused] = useState(false);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const response = await getCities();
                const payload = response?.data?.data ?? response?.data;
                const list =
                    (Array.isArray(payload) && payload) ||
                    (Array.isArray(payload?.cities) && payload.cities) ||
                    (Array.isArray(payload?.data) && payload.data) ||
                    (Array.isArray(payload?.data?.cities) && payload.data.cities) ||
                    [];
                setCities(list);
            } catch {
                // best effort; keep local suggestions
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, []);

    const handleNext = () => {
        // Basic validation
        if (!tripName.trim() || !destination.trim() || !selectedTripType || !selectedCityId) {
            alert('Please fill in all fields and select a trip type.');
            return;
        }

        router.push({
            pathname: '/create-trip/step-2',
            params: { tripName, destination, tripType: selectedTripType, cityId: selectedCityId },
        });
    };

    const filteredCities = destination.trim().length
        ? cities.filter((c) => c.name.toLowerCase().includes(destination.toLowerCase()))
        : cities;
    const showCityList = isDestinationFocused || destination.trim().length > 0;

    return (
            <View className="flex-1 bg-white pt-12 px-5">
                <StatusBar style="auto" />
            {/* Header */}
            <View className="flex-row items-center mb-8 mt-5">
                <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-300 rounded-full relative bottom-3  -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1f2937" className='' />
                </TouchableOpacity>
                <View>
                <Text className="text-3xl font-base text-gray-900 ml-3">Create New Trip</Text>
                 <Text className="text-gray-500 text-base mb-6 ml-3">Step 1 of 3</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-2 bg-gray-200 rounded-full mb-8">
                <View className="w-1/3 h-full bg-blue-600 rounded-full" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text className="text-xl text-gray-800 mb-3">Let's start with the basics</Text>
               

                {/* Trip Name Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-semibold mb-2">Trip Name *</Text>
                    <TextInput
                        className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900"
                        placeholder="e.g., Summer Vacation 2024"
                        placeholderTextColor="#9ca3af"
                        value={tripName}
                        onChangeText={setTripName}
                    />
                </View>

                {/* Destination Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 text-base font-semibold mb-2">Destination *</Text>
                    <TextInput
                        className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900"
                        placeholder="Where are you going?"
                        placeholderTextColor="#9ca3af"
                        value={destination}
                        onChangeText={(text) => {
                            setDestination(text);
                            setSelectedCityId(null);
                        }}
                        onFocus={() => setIsDestinationFocused(true)}
                        onBlur={() => {
                            // keep list open while typing; close only on selection
                        }}
                    />
                    {showCityList && (
                        <View className="mt-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <Text className="text-gray-700  mb-4">Select a city</Text>
                            <View className="flex-col flex-wrap">
                                {loadingCities && (
                                    <View className="py-2">
                                        <ActivityIndicator size="small" color="#1f2937" />
                                    </View>
                                )}
                                {!loadingCities && filteredCities.length === 0 && (
                                    <Text className="text-gray-500">No matching cities.</Text>
                                )}
                                {!loadingCities && filteredCities.map((city) => (
                                    <TouchableOpacity
                                        key={city._id}
                                        className="rounded-full px-4 py-2 mr-2 mb-2 w-full"
                                        onPress={() => {
                                            setDestination(city.name);
                                            setSelectedCityId(city._id);
                                            setIsDestinationFocused(false);
                                        }}
                                    >
                                        <Text className="text-black text-md">{city.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                    {!selectedCityId && destination.trim().length > 0 && (
                        <Text className="text-red-500 text-sm mt-2">Please select a city from the list.</Text>
                    )}
                </View>

                {/* Trip Type Selection */}
                <View className="mb-8">
                    <Text className="text-gray-700 text-base font-semibold mb-3">Trip Type</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {tripTypes.map((type) => (
                            <TouchableOpacity
                                key={type.name}
                                className={`
                                    w-[30%] items-center py-3 border rounded-xl mb-3
                                    ${selectedTripType === type.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                                `}
                                onPress={() => setSelectedTripType(type.name)}
                            >
                                <Ionicons 
                                    name={type.icon as any} 
                                    size={30} 
                                    color={selectedTripType === type.name ? '#3b82f6' : '#6b7280'} 
                                />
                                <Text className={`text-sm mt-1 ${selectedTripType === type.name ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    className={`w-full h-14 rounded-full flex-row items-center justify-center mb-6 ${
                        !tripName.trim() || !destination.trim() || !selectedTripType || !selectedCityId ? 'bg-blue-500' : 'bg-blue-600'
                    }`}
                    onPress={handleNext}
                    disabled={!tripName.trim() || !destination.trim() || !selectedTripType || !selectedCityId}
                >
                    <Text className="text-white text-lg font-semibold">Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default CreateTrip;
