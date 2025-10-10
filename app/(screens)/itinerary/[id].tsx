// app/(tabs)/itinerary/ItineraryDetails.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router"; // to grab the itinerary ID from route
import { getItineraryById } from "@/utils/axiosIntances";

interface Destination {
  _id: string;
  place: {
    _id: string;
    name: string;
    address?: string;
  };
  day: number;
  visited?: boolean;
}

interface Itinerary {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  places: Destination[];
  notes?: string;
}

const ItineraryDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // route param
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id!); // backend call
        if (response?.data?.data) {
          setItinerary(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch itinerary:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItinerary();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-sec">
        <ActivityIndicator size="large" color="#245678" />
        <Text className="mt-2 text-gray-600">Loading itinerary...</Text>
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View className="flex-1 justify-center items-center bg-sec">
        <Text className="text-gray-600">Itinerary not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-sec px-5 pt-6">
      {/* Header */}
      <Text className="text-2xl font-bold text-pry mb-2">{itinerary.title}</Text>
      <Text className="text-gray-600 mb-6">
        {itinerary.startDate.split("T")[0]} – {itinerary.endDate.split("T")[0]}
      </Text>

      {/* Stepper Timeline */}
      {itinerary.places.map((dest, index) => {
        const isLast = index === itinerary.places.length - 1;
        return (
          <View key={dest._id} className="flex-row">
            {/* Left Column: Stepper Icons + Line */}
            <View className="items-center">
              <View
                className={`h-8 w-8 rounded-full items-center justify-center ${
                  dest.visited ? "bg-green-500" : "bg-white border-2 border-pry"
                }`}
              >
                {dest.visited ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Ionicons name="location-outline" size={16} color="#245678" />
                )}
              </View>

              {/* Connector Line */}
              {!isLast && <View className="h-12 w-0.5 bg-gray-300" />}
            </View>

            {/* Right Column: Destination Info */}
            <View className="ml-4 mb-6 flex-1">
              <Text className="text-lg font-semibold text-pry">
                Day {dest.day}: {dest.place?.name}
              </Text>
              {dest.place?.address && (
                <Text className="text-gray-600 text-sm">{dest.place.address}</Text>
              )}
            </View>
          </View>
        );
      })}

      {/* Notes */}
      {itinerary.notes && (
        <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mt-4">
          <Text className="font-semibold text-pry mb-1">Notes</Text>
          <Text className="text-gray-600">{itinerary.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ItineraryDetails;
