import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

const interestsList = [
  "Adventure",
  "Beach & Sun",
  "Culture & History",
  "Food & Culinary",
  "Nightlife",
  "Nature & Hiking",
  "Art & Museums",
  "Shopping",
];

const Interest = () => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(x => x !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <View className="flex-1 px-4 py-6 bg-white">
      
      {/* Header */}
      <View className="mb-5">
        <Text className="text-2xl font-semibold text-pry">Select Your Interests</Text>
        <Text className="text-grey mt-1">
          Choose what excites you the most so we can tailor your experience.
        </Text>
      </View>

      {/* Interest Chips */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3 mt-4">
          {interestsList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleSelect(item)}
              className={`px-5 py-3 rounded-full border ${
                selected.includes(item)
                  ? "bg-pry border-pry"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`${
                  selected.includes(item) ? "text-white" : "text-gray-700"
                } font-medium`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="mt-6">
        <TouchableOpacity
          disabled={selected.length === 0}
          className={`py-4 rounded-md ${
            selected.length === 0 ? "bg-gray-300" : "bg-pry"
          }`}
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-white text-center font-medium text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Interest;
