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

const normalizeItinerary = (raw: any): Itinerary | null => {
  if (!raw) return null;
  const source = raw.itinerary || raw.data || raw;
  const title = source.title || source.name || "Itinerary";
  const startDate = source.startDate || source.start || source.dateStart;
  const endDate = source.endDate || source.end || source.dateEnd;
  const notes = source.notes || source.description;

  const places: Destination[] = [];

  if (Array.isArray(source.places)) {
    source.places.forEach((p: any, index: number) => {
      const placeObj = p.place || p;
      if (!placeObj) return;
      places.push({
        _id: p._id || placeObj._id || `${index}`,
        place: {
          _id: placeObj._id || p.placeId || `${index}`,
          name: placeObj.name || placeObj.title || "Place",
          address: placeObj.address || placeObj.location,
        },
        day: p.day ?? p.dayNumber ?? 1,
        visited: p.visited ?? p.completed,
      });
    });
  } else if (Array.isArray(source.days)) {
    source.days.forEach((day: any, dayIndex: number) => {
      const dayNumber = day.day ?? day.dayNumber ?? dayIndex + 1;
      const blocks = day.blocks || day.items || day.activities || [];
      if (!Array.isArray(blocks)) return;
      blocks.forEach((block: any, blockIndex: number) => {
        const placeObj = block.place || block.location || block;
        const name = placeObj?.name || block.title || block.name;
        if (!name) return;
        places.push({
          _id: block._id || placeObj?._id || `${dayIndex}-${blockIndex}`,
          place: {
            _id: placeObj?._id || block.placeId || `${dayIndex}-${blockIndex}`,
            name,
            address: placeObj?.address || block.address,
          },
          day: dayNumber,
          visited: block.visited ?? block.completed,
        });
      });
    });
  }

  if (!startDate || !endDate || places.length === 0) {
    return null;
  }

  return {
    _id: source._id || source.id || "itinerary",
    title,
    startDate,
    endDate,
    places,
    notes,
  };
};

const ItineraryDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // route param
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id!); // backend call
        const payload = response?.data?.data ?? response?.data;
        const normalized = normalizeItinerary(payload);
        if (normalized) setItinerary(normalized);
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
