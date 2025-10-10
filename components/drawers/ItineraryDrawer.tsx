// components/ItineraryDrawer.tsx

import React, { useMemo, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

interface Destination {
  id: string;
  name: string;
  address?: string;
  visited?: boolean;
}

interface Itinerary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  destinations: Destination[];
  notes?: string;
}

interface Props {
  itinerary: Itinerary;
  isOpen: boolean;
  onClose: () => void;
}

const ItineraryDrawer: React.FC<Props> = ({ itinerary, isOpen, onClose }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // snap points for drawer height
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={isOpen ? 0 : -1} // -1 = closed
      onClose={onClose}
      enablePanDownToClose
    >
      <ScrollView className="flex-1 px-5">
        {/* Header */}
        <Text className="text-2xl font-bold text-pry mb-2">{itinerary.title}</Text>
        <Text className="text-gray-600 mb-6">
          {itinerary.startDate} – {itinerary.endDate}
        </Text>

        {/* Stepper Timeline */}
        {itinerary.destinations.map((dest, index) => {
          const isLast = index === itinerary.destinations.length - 1;
          return (
            <View key={dest.id} className="flex-row">
              {/* Stepper icon */}
              <View className="items-center">
                <View
                  className={`h-8 w-8 rounded-full items-center justify-center ${
                    dest.visited
                      ? "bg-green-500"
                      : "bg-white border-2 border-pry"
                  }`}
                >
                  {dest.visited ? (
                    <Ionicons name="checkmark" size={16} color="white" />
                  ) : (
                    <Ionicons name="location-outline" size={16} color="#245678" />
                  )}
                </View>

                {!isLast && <View className="h-12 w-0.5 bg-gray-300" />}
              </View>

              {/* Info */}
              <View className="ml-4 mb-6 flex-1">
                <Text className="text-lg font-semibold text-pry">
                  Day {index + 1}: {dest.name}
                </Text>
                {dest.address && (
                  <Text className="text-gray-600 text-sm">{dest.address}</Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Notes */}
        {itinerary.notes && (
          <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mt-4 mb-8">
            <Text className="font-semibold text-pry mb-1">Notes</Text>
            <Text className="text-gray-600">{itinerary.notes}</Text>
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
};

export default ItineraryDrawer;
