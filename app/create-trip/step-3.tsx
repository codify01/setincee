import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { createTrip } from '@/utils/axiosIntances';

const CreateTripStep3: React.FC = () => {
    const { tripName, destination, tripType, startDate, endDate, travelers, cityId, pace, interests, preferredStartHour, preferredEndHour, allowSameDayCityTravel } = useLocalSearchParams();
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formattedStartDate = startDate ? new Date(startDate as string).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    const formattedEndDate = endDate ? new Date(endDate as string).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

    const calculateDuration = (start: string, end: string) => {
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    const toDateOnly = (iso?: string | string[]) => {
        if (!iso || typeof iso !== 'string') return '';
        const date = new Date(iso);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleCreateTrip = async () => {
        if (!cityId || typeof cityId !== 'string') {
            setError('Please select a city before creating a trip.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            let parsedInterests: string[] = [];
            if (typeof interests === 'string') {
                try {
                    parsedInterests = JSON.parse(interests);
                } catch {
                    parsedInterests = [];
                }
            }
            const payload = {
                title: tripName,
                description,
                cities: [{ cityId, name: destination }],
                startDate: toDateOnly(startDate as string),
                endDate: toDateOnly(endDate as string),
                preferences: {
                    pace: typeof pace === 'string' ? pace : 'normal',
                    interests: parsedInterests.length ? parsedInterests : [String(tripType)],
                    allowSameDayCityTravel: allowSameDayCityTravel === 'true',
                    preferredStartHour: Number(preferredStartHour) || 9,
                    preferredEndHour: Number(preferredEndHour) || 18,
                },
                selectedPlaces: [],
            };
           const response = await createTrip(payload);
           console.log('====================================');
           console.log(response);
           console.log('====================================');
            router.push('/(tabs)/trip');
        } catch (e) {
            setError('Failed to create trip. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white pt-12 px-5">
            {/* Header */}
            <View className="flex-row items-center mb-8 border-b border-gray-200 pb-4 pt-10">
                 <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-300 rounded-full relative bottom-3  -ml-2">
                                    <Ionicons name="arrow-back" size={24} color="#1f2937" className='' />
                                </TouchableOpacity>
                <View>
                <Text className="text-2xl font-bold text-gray-900 ml-3">Create New Trip</Text>
                   <Text className="text-gray-500 text-base mb-6 ml-3">Step 3 of 3</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View className="w-full h-2 bg-gray-200 rounded-full mb-8">
                <View className="w-full h-full bg-blue-600 rounded-full" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xl text-gray-800 mb-3">Tell us more about your trip</Text>
             

                {/* Description Input */}
                <View className="mb-8">
                    <Text className="text-gray-700 text-base font-semibold mb-2">Description (Optional)</Text>
                    <TextInput
                        className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 h-32 text-top"
                        placeholder="What are you planning to do? Any special occasions?"
                        placeholderTextColor="#9ca3af"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                    <Text className="text-right text-gray-500 text-sm mt-2">{description.length} / 500 characters</Text>
                </View>

                {/* Trip Summary */}
                <View className="bg-[#f8fafc] rounded-2xl p-5 mb-8 ">
                    <Text className="text-xl font-bold text-gray-900 mb-4">Trip Summary</Text>
                    <View className="mb-2">
                        <Text className="text-gray-600 text-base mb-1"><Text className="font-semibold">Trip Name:</Text> {tripName}</Text>
                        <Text className="text-gray-600 text-base mb-1"><Text className="font-semibold">Destination:</Text> {destination}</Text>
                        <Text className="text-gray-600 text-base mb-1"><Text className="font-semibold">Dates:</Text> {formattedStartDate} - {formattedEndDate}</Text>
                        <Text className="text-gray-600 text-base mb-1"><Text className="font-semibold">Duration:</Text> {calculateDuration(startDate as string, endDate as string)}</Text>
                        <Text className="text-gray-600 text-base"><Text className="font-semibold">Travelers:</Text> {travelers} person{Number(travelers) > 1 ? 's' : ''}</Text>
                    </View>
                </View>

                {/* Create Trip Button */}
                {error && <Text className="text-red-500 text-sm mb-3">{error}</Text>}
                <TouchableOpacity
                    className={`w-full h-14 rounded-full flex-row items-center justify-center mb-6 ${
                        !tripName || !destination || !tripType || !startDate || !endDate || !travelers || submitting ? 'bg-blue-400 opacity-50' : 'bg-blue-600'
                    }`}
                    onPress={handleCreateTrip}
                    disabled={!tripName || !destination || !tripType || !startDate || !endDate || !travelers || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-lg font-semibold">+ Create Trip</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default CreateTripStep3;
