import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Platform, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Header from '@/components/home/Header';
import SearchBar from '@/components/home/SearchBar';
import TrendingList from '@/components/home/TrendingList';
import RecommendedList from '@/components/home/RecommendedList';
import RecentTripList from '@/components/home/RecentTripsList';
import NearbyPlacesList from '@/components/home/NearByPlacesList';
import LiveMap from '@/components/home/LiveMap';
import { useAuth } from '@/context/AuthContext';
import SearchSuggestions from '@/components/home/SearchSugestions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AiIcon from '../../assets/icons/ai.svg';
import CategoryTab from '@/components/home/CategoryTab';
import HomeSkeleton from '@/components/skeletons/HomeSkeleton';
import { useHomeTabData } from '@/hooks/useHomeTabData';
import { useLocation } from '@/hooks/useLocation';
import { router } from 'expo-router';

const HomeScreen = () => {
  const { user } = useAuth();
  const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const { location, locationText, loading: loadingLocation, error: locationError } = useLocation();
  const { data, loading, error } = useHomeTabData({
    lat: location?.latitude,
    lng: location?.longitude,
  });
  const [searchText, setSearchText] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('Food & Restaurant');

  useEffect(() => {
    if (searchText.length > 1) {
      setSearchSuggestions([
        `${searchText} Park`,
        `${searchText} Museum`,
        `Best ${searchText} Spots`,
      ]);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchText]);
  const categoriesData = data?.categories ?? [];
  const trendingData = data?.trending ?? [];
  const recommendedPlaces = data?.recommendedPlaces ?? [];
  const nearbyPlaces = data?.nearbyPlaces ?? [];
  const recentTrips = data?.recentTrips ?? [];
  const firstName = data?.user?.firstName || user?.firstName || 'Guest';

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: topPadding }}>
      {loading ? (
        <HomeSkeleton />
      ) : (
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 40 }} className="container">
        <Header firstName={firstName} locationText={locationText} />

        <SearchBar value={searchText} onChange={setSearchText} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
          {categoriesData.map((category) => (
            <CategoryTab
              key={category.id}
              title={category.title}
              imageSource={category.image}
              isActive={activeCategory === category.title}
              onPress={() => setActiveCategory(category.title)}
              showImage={true}
              imageSize={22}
            />
          ))}
        </ScrollView>
        <SearchSuggestions suggestions={searchSuggestions} onSelect={(s) => { setSearchText(s); setSearchSuggestions([]); }} />
        {error && (
          <Text className="text-center text-gray-500">{error}</Text>
        )}

        {/* <CategoryList categories={categories} /> */}

        <NearbyPlacesList data={nearbyPlaces} />
        <TouchableOpacity onPress={() => router.push('/create-trip')}>
          <View className='border border-dashed h-[200px] rounded-lg flex-col items-center justify-center gap-5'>
                <View className='w-16 h-16 rounded-full flex justify-center items-center bg-sec'>
                  <Ionicons name='add' size={30} color={'white'}/>
                </View>
                <Text className='text-center text-xl font-medium'>Create Your First Trip</Text>
                <Text className='text-center text-neutral-200 '>Start planning your perfect itinerary</Text>
          </View>
        </TouchableOpacity>
        <TrendingList data={trendingData} />

        <RecommendedList places={recommendedPlaces} />

        <LiveMap location={location} loading={loadingLocation} error={locationError || error} />

        <RecentTripList trips={recentTrips} />
        
      </ScrollView>
      )}
      <View className=' absolute bottom-72 right-5 '>
        <TouchableOpacity onPress={() => router.push('/bot/botchat')}>
           <LinearGradient
                  colors={[ '#9810FA', '#155DFC']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }} 
                  style={styles.gradientButton}
                  >
                  <AiIcon width={30} height={25} />
                </LinearGradient>
                  
                          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 999,
    width: 64,
    height: 64,
  },
});

export default HomeScreen;
