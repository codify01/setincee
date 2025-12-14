import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React from "react";
import { categoryDetails } from "@/data/categories";


const CategoryDetails = () => {
  const { slug } = useLocalSearchParams();
  const data = categoryDetails[slug];

  return (
    <ScrollView className="flex-1 bg-white">
      
      {/* Image */}
      <Image source={{ uri: data?.image }} className="w-full h-56" />

      <View className="px-4 py-6">

        {/* Title */}
        <Text className="text-2xl font-semibold text-pry">{data?.title}</Text>

        {/* Description */}
        <Text className="text-grey mt-2 leading-6">{data?.description}</Text>

        {/* List / Highlights */}
        <Text className="text-lg font-medium mt-6 mb-3">Popular Options</Text>
        <View className="gap-3">
          {data?.highlights?.map((item, index) => (
            <View
              key={index}
              className="px-4 py-3 rounded-xl border border-gray-300"
            >
              <Text className="text-gray-800 text-base">{item}</Text>
            </View>
          ))}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          className="mt-8 py-4 bg-pry rounded-md"
          onPress={() => router.back()}
        >
          <Text className="text-center text-white font-medium">Go Back</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default CategoryDetails;
