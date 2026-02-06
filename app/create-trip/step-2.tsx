import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTripStep2: React.FC = () => {
    const { tripName, destination, tripType, cityId } = useLocalSearchParams();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [travelers, setTravelers] = useState(1);
    const [dateError, setDateError] = useState<string | null>(null);
    const [pace, setPace] = useState<'slow' | 'normal' | 'fast'>('normal');
    const [interests, setInterests] = useState<string[]>([]);
    const [preferredStartHour, setPreferredStartHour] = useState('9');
    const [preferredEndHour, setPreferredEndHour] = useState('18');
    const [allowSameDayCityTravel, setAllowSameDayCityTravel] = useState(false);

    const interestOptions = ['food', 'museums', 'nature', 'nightlife', 'shopping', 'family'];

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
        validateDates(currentDate, endDate);
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
        validateDates(startDate, currentDate);
    };

    const validateDates = (start: Date | null, end: Date | null) => {
        if (start && end) {
            if (end < start) {
                setDateError("End date cannot be before start date.");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    };

    const handleNext = () => {
        if (!startDate || !endDate || dateError) {
            alert('Please select valid start and end dates.');
            return;
        }
        router.push({
            pathname: '/create-trip/step-3',
            params: {
                tripName,
                destination,
                tripType,
                cityId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                travelers,
                pace,
                interests: JSON.stringify(interests),
                preferredStartHour,
                preferredEndHour,
                allowSameDayCityTravel: String(allowSameDayCityTravel),
            },
        });
    };

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'MM/DD/YYYY';
    };

    const calculateDuration = (start: Date | null, end: Date | null) => {
        if (start && end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? `Your trip will be ${diffDays} days long.` : "";
        }
        return "";
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
                               <Text className="text-gray-500 text-base mb-6 ml-3">Step 2 of 3</Text>
                            </View>
                        </View>

            {/* Progress Bar */}
            <View className="w-full h-2 bg-gray-200 rounded-full mb-8">
                <View className="w-2/3 h-full bg-blue-600 rounded-full" />
            </View>

        <ScrollView>

            <Text className="text-xl text-gray-800 mb-3">When are you traveling?</Text>
          

            {/* Start Date Input */}
            <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-2">Start Date *</Text>
                <TouchableOpacity
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base justify-center"
                    onPress={() => setShowStartDatePicker(true)}
                >
                    <Text className={startDate ? "text-gray-900" : "text-gray-400"}>
                        {formatDate(startDate)}
                    </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onStartDateChange}
                    />
                )}
            </View>

            {/* End Date Input */}
            <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-2">End Date *</Text>
                <TouchableOpacity
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base justify-center"
                    onPress={() => setShowEndDatePicker(true)}
                >
                    <Text className={endDate ? "text-gray-900" : "text-gray-400"}>
                        {formatDate(endDate)}
                    </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onEndDateChange}
                    />
                )}
                {dateError && <Text className="text-red-500 text-sm mt-2">{dateError}</Text>}
                {!dateError && startDate && endDate && <Text className="text-[#1c398e] text-sm mt-5 py-5 p-5 rounded-xl border border-[#2181f6] bg-[#BEDBFF]">{calculateDuration(startDate, endDate)}</Text>}
            </View>

            {/* Number of Travelers */}
            <View className="mb-8">
                <Text className="text-gray-700 text-base font-semibold mb-2">Number of Travelers</Text>
                <View className="flex-row items-center justify-between bg-white border border-gray-300 rounded-xl p-4">
                    <TouchableOpacity onPress={() => setTravelers(Math.max(1, travelers - 1))}>
                        <Ionicons name="remove-circle-outline" size={30} color="#6b7280" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">{travelers}</Text>
                    <TouchableOpacity onPress={() => setTravelers(travelers + 1)}>
                        <Ionicons name="add-circle-outline" size={30} color="#6b7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Preferences */}
            <View className="mb-8">
                <Text className="text-xl text-gray-800 mb-3">Preferences</Text>

                <Text className="text-gray-700 text-base font-semibold mb-2">Pace</Text>
                <View className="flex-row gap-3 mb-4">
                    {(['slow', 'normal', 'fast'] as const).map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`px-4 py-2 rounded-full border ${
                                pace === option ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                            }`}
                            onPress={() => setPace(option)}
                        >
                            <Text className={`${pace === option ? 'text-blue-600' : 'text-gray-700'}`}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-gray-700 text-base font-semibold mb-2">Interests</Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                    {interestOptions.map((option) => {
                        const active = interests.includes(option);
                        return (
                            <TouchableOpacity
                                key={option}
                                className={`px-4 py-2 rounded-full border ${
                                    active ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                                }`}
                                onPress={() =>
                                    setInterests((prev) =>
                                        prev.includes(option)
                                            ? prev.filter((i) => i !== option)
                                            : [...prev, option]
                                    )
                                }
                            >
                                <Text className={`${active ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text className="text-gray-700 text-base font-semibold mb-2">Preferred Day Hours</Text>
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1">
                        <Text className="text-gray-500 text-sm mb-1">Start Hour (0-23)</Text>
                        <TextInput
                            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-base text-gray-900"
                            keyboardType="number-pad"
                            value={preferredStartHour}
                            onChangeText={setPreferredStartHour}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-500 text-sm mb-1">End Hour (0-23)</Text>
                        <TextInput
                            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-base text-gray-900"
                            keyboardType="number-pad"
                            value={preferredEndHour}
                            onChangeText={setPreferredEndHour}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="flex-row items-center gap-3"
                    onPress={() => setAllowSameDayCityTravel((prev) => !prev)}
                >
                    <Ionicons
                        name={allowSameDayCityTravel ? 'checkbox' : 'square-outline'}
                        size={24}
                        color={allowSameDayCityTravel ? '#2563eb' : '#6b7280'}
                    />
                    <Text className="text-gray-700">Allow same-day city travel</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                    className="w-[48%] h-14 border-gray-200 border bg-transparent rounded-2xl flex-row items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Text className="text-gray-700 text-lg font-semibold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`w-[48%] h-14 rounded-2xl flex-row items-center justify-center ${
                        !startDate || !endDate || !!dateError ? 'bg-blue-600 opacity-50' : 'bg-blue-600'
                    }`}
                    onPress={handleNext}
                    disabled={!startDate || !endDate || !!dateError}
                >
                    <Text className="text-white text-lg font-semibold">Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

        </View>
    );
};

export default CreateTripStep2;
