import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Platform, View, Text, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AiIcon from '../../assets/icons/ai.svg';
import CategoryTab from '@/components/home/CategoryTab';

// Dummy data (replace with API calls)
const categories = [
  { 
    id: '1', 
    name: 'Nature', 
    slug: 'nature',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
  },
  { 
    id: '2', 
    name: 'Cities', 
    slug: 'cities',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg",
  },
  { 
    id: '3', 
    name: 'Culture', 
    slug: 'culture',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135824/samples/people/jazz.jpg",
  },
  { 
    id: '4', 
    name: 'Adventure', 
    slug: 'adventure',
    image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/landscapes/beach-boat.jpg",
  },
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
    {
    id: '2',
    name: 'Coffee Spot',
    distance: '0.8 km',
    image: require('@/assets/images/splash/page1.png'),
  },
    {
    id: '2',
    name: 'Coffee Spot',
    distance: '0.8 km',
    image: require('@/assets/images/splash/page1.png'),
  },
];

 const categoriesData = [
  { 
    id: '1',
    title: 'Food & Restaurant', 
    image: require('@/assets/images/food.jpg') 
  },
  { 
    id: '2',
    title: 'Cinemas', 
    image: require('@/assets/images/pack.jpg') 
  },
  { 
    id: '3',
    title: 'Parks', 
    image: require('@/assets/images/cinema.jpg') 
  },

];
const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [searchText, setSearchText] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
//   const [categories, setCategories] = useState();
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>();
  const [activeCategory, setActiveCategory] = useState('Food & Restaurant');

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
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: topPadding }}>
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 40 }} className="container">
        <Header firstName={user?.firstName || 'Guest'} />

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

        {/* <CategoryList categories={categories} /> */}

        <NearbyPlacesList data={mockNearbyPlaces} />
        <View>
          <View className='border border-dashed h-[200px] rounded-lg flex-col items-center justify-center gap-5'>
                <View className='w-16 h-16 rounded-full flex justify-center items-center bg-sec'>
                  <Ionicons name='add' size={30} color={'white'}/>
                </View>
                <Text className='text-center text-xl font-medium'>Create Your First Trip</Text>
                <Text className='text-center text-neutral-200 '>Start planning your perfect itinerary</Text>
          </View>
        </View>
        <TrendingList data={categories} />

        <RecommendedList places={recommendedPlaces} />

        <LiveMap location={location} loading={loadingLocation} error={errorMsg} />

        <RecentTripList trips={recentTrips} />
        
      </ScrollView>
      <View className=' absolute bottom-72 right-5 '>
           <LinearGradient
                  colors={[ '#9810FA', '#155DFC']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }} 
                  style={styles.gradientButton}
                >
                  <AiIcon width={30} height={25} />
                </LinearGradient>
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
