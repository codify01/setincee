import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import PlacesPreviewCard from '@/components/cards/PlacesPreviewCard';
import TrendingList from '@/components/exploreComponent/TrendingList';
import NearbyPreview from '@/components/exploreComponent/NearByPreview';
import LiveMap from '@/components/home/LiveMap';
import AiIcon from '../../assets/icons/ai.svg';

import { searchplaces } from '@/utils/axiosIntances';
import ExploreSkeleton from '@/components/skeletons/ExploreSkeleton';
import { useExploreTabData } from '@/hooks/useExploreTabData';
import { useLocation } from '@/hooks/useLocation';

const defaultCategoriesTab = [
  { name: 'All', icon: '🔍', value: 'all' },
  { name: 'Food', icon: '🍽️', value: 'restaurant' },
  { name: 'Nature', icon: '🌿', value: 'nature' },
  { name: 'Culture', icon: '🏛️', value: 'culture' },
  { name: 'Nightlife', icon: '🌙', value: 'nightlife' },
];

/* ---------------- SEARCH SERVICE ---------------- */
const searchPlace = async (query: string) => {
  try {
    if (!query || query.trim().length < 2) return [];

    const response = await searchplaces(query);
    
    return Array.isArray(response?.data?.data)
      ? response.data.data
      : [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

/* ---------------- COMPONENT ---------------- */
const Explore: React.FC = () => {
  const { location, loading: loadingLocation, error: locationError } = useLocation();
  const { data, loading: tabLoading, error: tabError } = useExploreTabData({
    lat: location?.latitude,
    lng: location?.longitude,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [showMapModal, setShowMapModal] = useState(false);

  const categoriesTab = data?.categories ?? defaultCategoriesTab;
  const trendingData = data?.trending ?? [];

  /* ---------------- AUTOCOMPLETE (DEBOUNCED) ---------------- */
  useEffect(() => {
    const delay = setTimeout(async () => {
      const results = await searchPlace(searchQuery);
      setSuggestions(results);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const places = data?.places ?? [];

  /* ---------------- HELPERS ---------------- */
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSearchResults(false);
  };

  /* ---------------- RENDERERS ---------------- */
  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item.name)}
      className={`px-5 py-3 rounded-full mr-3 flex-row items-center gap-2 ${
        selectedCategory === item.name
          ? 'bg-blue-100 border border-blue-200'
          : 'bg-[#f1f5f9]'
      }`}
    >

      <Text
        className={`font-semibold ${
          selectedCategory === item.name ? 'text-blue-600' : 'text-gray-700'
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => router.push(`/place/${item._id}`)}
    >
      <View className="flex-row items-start">
        <View className="w-20 h-20 rounded-xl overflow-hidden mr-4">
          <Image source={{ uri: item.images?.[0] }} className="w-full h-full" />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">{item.address}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceItem = ({ item }: any) => (
    <PlacesPreviewCard
      id={item._id}
      name={item.name}
      description={item.address}
      image={item.images?.[0]}
    />
  );

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-[#f3f7fa]">
      {tabLoading ? (
        <ExploreSkeleton />
      ) : (
        <>
      {/* HEADER */}
      <View className="absolute left-0 right-0 bg-[#f3f7fa] z-10 pt-12 pb-4 px-5">
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold">Explore</Text>
            <Text className="text-gray-500">Discover your city</Text>
          </View>
          <Ionicons name="filter-outline" size={24} color="#6b7280" />
        </View>

        {/* SEARCH BAR */}
        <View className="flex-row items-center">
          {showSearchResults && (
            <TouchableOpacity onPress={clearSearch} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
          )}

          <View className="flex-1 bg-gray-50 border border-gray-200 flex-row items-center p-4 rounded-3xl">
            <Ionicons name="search" size={22} color="#9ca3af" />
            <TextInput
              placeholder="Search places..."
              className="flex-1 ml-3"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSearchResults(text.trim().length > 1);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close" size={22} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* CATEGORIES */}
        <View className="mt-4">
          <FlatList
            data={categoriesTab}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 160, paddingBottom: 80, paddingHorizontal: 20 }}
      >
        {tabError ? (
          <Text className="text-center text-gray-500 mt-10">{tabError}</Text>
        ) : showSearchResults ? (
          <>
            <Text className="text-2xl font-bold mt-24 mb-4">
              Found {suggestions.length} places
            </Text>

            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                renderItem={renderSearchResultItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            ) : (
              <Text className="text-center text-gray-500 mt-10">
                No results yet
              </Text>
            )}
          </>
        ) : (
          <>
            <View className="mt-24">
              <TrendingList data={trendingData}/>
            </View>

            <NearbyPreview
              placeCount={places.length}
              onOpenMap={() => setShowMapModal(true)}
            />

            <FlatList
              data={places}
              renderItem={renderPlaceItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>

      {/* MAP MODAL */}
      <Modal visible={showMapModal} animationType="slide">
        <LiveMap location={location} loading={loadingLocation} error={locationError || tabError} />
      </Modal>

      {/* AI BUTTON */}
      <View className="absolute bottom-72 right-5">
        <TouchableOpacity onPress={() => router.push('/bot/botchat')}>
          <LinearGradient
            colors={['#9810FA', '#155DFC']}
            style={styles.gradientButton}
          >
            <AiIcon width={30} height={25} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    width: 64,
    height: 64,
  },
});

export default Explore;
