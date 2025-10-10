import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getItineraries } from '@/utils/axiosIntances';

interface Itinerary {
  id: string;
  title: string;
  destinations: string[];
  dateRange: string;
  startDate: string;
  endDate: string;
  progress: string;
}

const mockItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Lagos Weekend Getaway',
    destinations: ['Lekki', 'Victoria Island'],
    dateRange: '2025-05-18 – 2025-05-21',
    startDate: '2025-05-18',
    endDate: '2025-05-21',
    progress: '3/5 places visited',
  },
  {
    id: '2',
    title: 'Ogbomoso Cultural Tour',
    destinations: ['Oja Igbo', 'Palace Museum'],
    dateRange: '2025-06-05 – 2025-06-10',
    startDate: '2025-06-05',
    endDate: '2025-06-10',
    progress: '2/6 places visited',
  },
];

const ItineraryCard = ({ item }: { item: Itinerary }) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-md"
    onPress={() => router.push(`/itinerary/${item.id}`)}
    accessible
    accessibilityLabel={`Open itinerary for ${item.title}`}
  >
    <Image
      source={require('../../assets/images/splash/page1.png')}
      className="w-24 h-24 rounded-lg"
    />
    <View className="flex-col flex-1">
      <Text className="text-gray-600 text-sm">{item.startDate.split("T")[0]} - {item.endDate.split("T")[0]}</Text>
      <Text className="text-lg font-semibold text-pry mt-1">{item.title}</Text>
      <Text className="text-sm text-gray-500 truncate">
        {item.places?.map(p => p.place?.name).join(", ")}
      </Text>
      <Text className="text-xs text-green-600 mt-1">{item.progress.visited}/{item.progress.total} places</Text>
      <View className="flex-row gap-2 mt-2">
        <View className="flex-row items-center bg-pry px-3 py-1 rounded-md">
          <Ionicons name="map-outline" size={16} color="#fff" />
          <Text className="text-xs text-white ml-1">Map</Text>
        </View>
        <View className="flex-row items-center bg-pry px-3 py-1 rounded-md">
          <Ionicons name="checkmark-done-outline" size={16} color="#fff" />
          <Text className="text-xs text-white ml-1">Checklist</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const TripScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>(mockItineraries);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(()=>{
    const fetchData = async()=>{
      try {
        const response = await getItineraries();
        setItineraries(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching itineraries:', error.response?.data || error.message);
      }
    }
    fetchData();
  },[])

  const filteredItineraries = useMemo(() => {
    if (!selectedDate) return itineraries;
    return itineraries.filter(
      (item) => selectedDate >= item.startDate && selectedDate <= item.endDate
    );
  }, [selectedDate, itineraries]);

  return (
    <View className="flex-1 bg-sec px-5 pt-5">
      {/* Calendar Section */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  marked: true,
                  selectedColor: '#3B82F6',
                },
              }
            : undefined
        }
        theme={{
          backgroundColor: '#F9FAFB',
          calendarBackground: '#F9FAFB',
          textSectionTitleColor: '#9CA3AF',
          selectedDayBackgroundColor: '#3B82F6',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#10B981',
          dayTextColor: '#111827',
          textDisabledColor: '#D1D5DB',
          arrowColor: '#245678',
          monthTextColor: '#111827',
          textMonthFontWeight: 'bold',
          textDayFontWeight: '500',
          textDayHeaderFontWeight: '600',
          textMonthFontSize: 18,
          textDayFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
        style={{
          marginBottom: 20,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      />

      {/* Create New Itinerary */}
      <TouchableOpacity
        className="flex-row items-center justify-center bg-pry py-4 rounded-xl mb-6 shadow-lg"
        onPress={() => router.push('(modals)/CreateItinerary')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text className="text-white text-base font-semibold ml-2">
          Create New Itinerary
        </Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold mb-3 text-pry">
        {selectedDate ? `Trips on ${selectedDate}` : 'Saved Itineraries'}
      </Text>

      {filteredItineraries.length > 0 ? (
        <FlatList
          data={filteredItineraries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItineraryCard item={item} />}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <View className="items-center mt-10">
          <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-2">
            No itineraries for this date.
          </Text>
        </View>
      )}

      <Modal
              animationType="slide"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white border border-pry w-full rounded-xl p-6 max-h-[80%]">
                  <Text className="text-xl font-bold text-gray-800 mb-4">Preview Itinerary</Text>
                  
                  <View className="flex-row justify-between mt-4">
                    <TouchableOpacity
                      className="flex-1 py-3 mr-2 border border-gray-300 rounded-xl items-center"
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className="text-gray-700 font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-3 ml-2 bg-pry rounded-xl items-center"
                      // onPress={saveItinerary}
                    >
                      <Text className="text-white font-semibold">Confirm & Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
      
    </View>
  );
};

export default TripScreen;
