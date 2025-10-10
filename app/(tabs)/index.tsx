import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import Header from '@/components/home/Header';
import SearchBar from '@/components/home/SearchBar';
import CategoryList from '@/components/home/CategoryList';
import TrendingList from '@/components/home/TrendingList';
import RecommendedList from '@/components/home/RecommendedList';
import RecentTripList from '@/components/home/RecentTripsList';
import NearbyPlacesList from '@/components/home/NearByPlacesList';
import LiveMap from '@/components/home/LiveMap';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import SearchSuggestions from '@/components/home/SearchSugestions';
import { getAllPlaces } from '@/utils/axiosIntances';
import { Place } from '../(screens)/PlaceDetailsScreen/[id]';

// Dummy data (replace with API calls)
const categories = [
  { id: '1', name: 'Nature', image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg" },
  { id: '2', name: 'Cities', image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg" },
  { id: '3', name: 'Culture', image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135824/samples/people/jazz.jpg" },
  { id: '4', name: 'Adventure', image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/landscapes/beach-boat.jpg" },
];

const recommendedPlaces = [
  {
    id: 'r1',
    name: 'Victoria Island',
    rating: 4.8,
    image: require('@/assets/images/splash/page1.png'),
    description: 'Beautiful beach and city blend perfect for weekend getaways.',
  },
  {
    id: 'r2',
    name: 'Obudu Cattle Ranch',
    rating: 4.7,
    image: require('@/assets/images/splash/page1.png'),
    description: 'Nature retreat with amazing views and cool climate.',
  },
];

const recentTrips = [
  {
    id: 't1',
    name: 'Lagos City Tour',
    date: '2025-06-01',
    image: require('@/assets/images/splash/page1.png'),
  },
  {
    id: 't2',
    name: 'Beach Weekend',
    date: '2025-07-15',
    image: require('@/assets/images/splash/page1.png'),
  },
];

const mockNearbyPlaces = [
  {
    id: '1',
    name: 'Local Park',
    distance: '0.5 km',
    image: require('@/assets/images/splash/page1.png'),
  },
  {
    id: '2',
    name: 'Coffee Spot',
    distance: '0.8 km',
    image: require('@/assets/images/splash/page1.png'),
  },
];

const HomeScreen = () => {
  const { user } = useAuth();
  const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [searchText, setSearchText] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
//   const [categories, setCategories] = useState();
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoadingLocation(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoadingLocation(false);
    })();
  }, []);

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

  useEffect(() => {
	const fetchData = async () => {
	  try {
		const response = await Promise.all([
			getAllPlaces(),
		])
		if (response && response.length > 0) {
		  // Assuming the API returns an array of places
		  const places:Place[] = response[0].data.data;
		  if (places && places.length > 0) {
			setRecommendedPlaces(places.slice(0, 10));
		  }
		  // You can set the places to state or use them directly
		  // console.log('Fetched Places:', places);
		} else {
		  setErrorMsg('No places found.');
		}
	  } catch (error) {
		setErrorMsg('Failed to fetch data. Please try again later.');
	  }
	}
	fetchData();
  }, [errorMsg]);

  return (
    <SafeAreaView className="flex-1 bg-sec" style={{ paddingTop: topPadding }}>
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 40 }} className="container">
        <Header firstName={user?.firstName || 'Guest'} />
        <SearchBar value={searchText} onChange={setSearchText} />
        <SearchSuggestions suggestions={searchSuggestions} onSelect={(s) => { setSearchText(s); setSearchSuggestions([]); }} />

        <CategoryList categories={categories} />

        <TrendingList data={categories} />

        <RecommendedList places={recommendedPlaces} />

        <RecentTripList trips={recentTrips} />

        <LiveMap location={location} loading={loadingLocation} error={errorMsg} />

        <NearbyPlacesList data={mockNearbyPlaces} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
