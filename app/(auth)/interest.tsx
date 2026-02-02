import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import ButtonSolid from '@/components/buttons/ButtonSolid';

const interestsList = [
  "Food", "Culture", "Mountain", 
  "Beaches", "Nightlife", "Nature",
  "Sport", "Games", "Adventure",
  "Shopping", "History", "Art",
  "Photography", "Wellness"
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
    <View className="flex-1 px-6 bg-[#f3f7fa]">

      
      {/* Header */}
      <View className="px-6 pt-8 mt-12 flex-row justify-start items-start gap-2">
  <View className="h-[5px] w-20 bg-[#9810fa] rounded-full mx-auto"></View>
    <View className="h-[5px] w-20 bg-[#9810fa] rounded-full mx-auto"></View>
      <View className="h-[5px] w-20 bg-[#9810fa] rounded-full mx-auto"></View>
        <View className="h-[5px] w-20 bg-[#9810fa] rounded-full mx-auto"></View>
</View>

<View className="mt-12 mb-8 ">
        <Text className="text-3xl font-bold text-gray-900">Made Just for You</Text>
        <Text className="text-base text-gray-600 mt-2 text-[16px]">
          Pick your interests so we can tailor your travel inspiration
        </Text>
      </View>

      {/* Interest Chips */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap gap-4">
          {interestsList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleSelect(item)}
              className={`
                px-6 py-3  rounded-3xl border-2 
                ${selected.includes(item)
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white-100 border-gray-200"
                }
                
              `}
            >
              <Text
                className={`
                  text-center font-semibold text-lg
                  ${selected.includes(item) ? "text-white" : "text-gray-800"}
                `}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
             {/* Interest Selection Counter */}
     
      </ScrollView>

      {/* Footer Buttons */}
      <View className="pt-4">
         <View className="mb-4">
        <Text className="text-sm text-center font-medium  text-gray-500">
          Selected {selected.length} interests
        </Text>
      </View>
        </View>
      {/* Footer Buttons */}
      <View className="py-6 px-6 mb-8">
  <View className="flex-row justify-between items-center gap-4">
    <TouchableOpacity
      className="w-[48%] py-4 bg-white border border-gray-200 rounded-xl"
      onPress={() => router.back()}
    >
      <Text className="text-gray-600 text-center font-semibold text-base">
        Skip
      </Text>
    </TouchableOpacity>
  
    <ButtonSolid
      disabled={selected.length === 0}
      // className="w-[48%] px-16 py-4 rounded-xl"
      // style={{ backgroundColor: selected.length === 0 ? '#d1d5db' : undefined }}
      onPress={() => router.push("/(tabs)")}
      title="Continue"
    />
  </View>
</View>

    </View>
  );
};

export default Interest;