import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
    Image,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import PlacesPreviewCard from '@/components/cards/PlacesPreviewCard';
import { getAllPlaces } from '@/utils/axiosIntances';
import { router } from 'expo-router';
import TrendingList from '@/components/exploreComponent/TrendingList';
import { LinearGradient } from 'expo-linear-gradient';
import AiIcon from '../../assets/icons/ai.svg';
import LiveMap from '@/components/home/LiveMap';
import NearbyPreview from '@/components/exploreComponent/NearByPreview';

const categoriesTab = [
    { name: 'All', icon: '🔍', value: 'all' },
    { name: 'Food', icon: '🍽️', value: 'restaurant' },
    { name: 'Nature', icon: '🌿', value: 'nature' },
    { name: 'Culture', icon: '🏛️', value: 'culture' },
    { name: 'Nightlife', icon: '🌙', value: 'nightlife' },
];

const trendingData = [
    {
        id: '1',
        name: 'Beachside Restaurant',
        cuisine: 'Seafood & Grill',
        distance: '2.5 km away',
        rating: 4.8,
        reviews: 124,
        image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
    },
    {
        id: '2',
        name: 'Italian Bistro',
        cuisine: 'Italian Cuisine',
        distance: '3.2 km away',
        rating: 4.6,
        reviews: 89,
        image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg",
    },
];

// Mock search results data structure matching your screenshot
const mockSearchResults = [
    {
        _id: '1',
        name: 'Joliol Junction',
        type: 'Nigerian Cuisine',
        category: 'restaurant',
        rating: 4.5,
        reviewCount: 252,
        distance: 6.2,
        price: '$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Lagos, Nigeria'
    },
    {
        _id: '2',
        name: 'Elegushi Beach',
        type: 'Beach & Recreation',
        category: 'nature',
        rating: 4.7,
        reviewCount: 267,
        distance: 5.3,
        price: '$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Lekki, Lagos'
    },
    {
        _id: '3',
        name: 'Nike Art Gallery',
        type: 'Art & Culture',
        category: 'culture',
        rating: 4.8,
        reviewCount: 267,
        distance: 3.8,
        price: '$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Lekki, Lagos'
    },
    {
        _id: '4',
        name: 'Oullox Nightclub',
        type: 'Nightlife & Entertainment',
        category: 'nightlife',
        rating: 4.6,
        reviewCount: 443,
        distance: 2.1,
        price: '$$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Victoria Island, Lagos'
    },
    {
        _id: '5',
        name: 'Sky Lounge',
        type: 'Rooftop Dining',
        category: 'restaurant',
        rating: 4.9,
        reviewCount: 270,
        distance: 7.7,
        price: '$$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Lagos, Nigeria'
    },
    {
        _id: '6',
        name: 'Lekki Conservation Centre',
        type: 'Nature & Wildlife',
        category: 'nature',
        rating: 4.8,
        reviewCount: 323,
        distance: 2.1,
        price: '$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Lekki, Lagos'
    },
    {
        _id: '7',
        name: 'Craft Gourmet',
        type: 'Fine Dining',
        category: 'restaurant',
        rating: 4.7,
        reviewCount: 42,
        distance: 1.8,
        price: '$$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Lagos, Nigeria'
    },
    {
        _id: '8',
        name: 'Freedom Park Lagos',
        type: 'Historic Site',
        category: 'culture',
        rating: 4.5,
        reviewCount: 269,
        distance: 3.5,
        price: '$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Lagos Island, Lagos'
    },
];

const Explore: React.FC = () => {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
    const [showMapModal, setShowMapModal] = useState(false);
    
    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

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
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const response = await getAllPlaces();
                if (response && response.data && Array.isArray(response.data.data)) {
                    setPlaces(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching places:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
            setSelectedCategory('All');
            return;
        }
        
        setIsSearching(true);
        setShowSearchResults(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Filter mock data by search query
            const filteredResults = mockSearchResults.filter(place =>
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.type.toLowerCase().includes(query.toLowerCase()) ||
                place.address.toLowerCase().includes(query.toLowerCase())
            );
            
            // Filter by selected category if not "All"
            const categoryValue = categoriesTab.find(cat => cat.name === selectedCategory)?.value;
            const finalResults = categoryValue && categoryValue !== 'all'
                ? filteredResults.filter(place => place.category === categoryValue)
                : filteredResults;
            
            setSearchResults(finalResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
        setSearchResults([]);
        setSelectedCategory('All');
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        
        // If we're in search results mode, filter the search results
        if (showSearchResults && searchQuery.trim()) {
            const categoryValue = categoriesTab.find(cat => cat.name === categoryName)?.value;
            const filteredResults = mockSearchResults.filter(place =>
                (place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 place.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 place.address.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (categoryValue === 'all' || place.category === categoryValue)
            );
            setSearchResults(filteredResults);
        }
    };

    const renderCategoryItem: ListRenderItem<any> = ({ item }) => (
        <TouchableOpacity 
            onPress={() => handleCategorySelect(item.name)}
            className={`
                px-5 py-3 rounded-full mr-3 flex-row items-center gap-2 
                ${selectedCategory === item.name 
                    ? 'bg-blue-100 border border-blue-200' 
                    : 'bg-[#f1f5f9]'
                }
            `}
        >
            <Text className={`text-lg ${selectedCategory === item.name ? 'text-blue-600' : 'text-gray-900'}`}>
                {item.icon}
            </Text>
            <Text className={`font-semibold ${selectedCategory === item.name ? 'text-blue-600' : 'text-gray-700'}`}>
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
                {/* Place Image */}
                <View className="w-20 h-20 rounded-xl overflow-hidden mr-4">
                    <Image 
                        source={{ uri: item.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                
                {/* Place Info */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={16} color="#f59e0b" />
                            <Text className="ml-1 font-semibold text-gray-700">{item.rating}</Text>
                            <Text className="ml-1 text-gray-500">({item.reviewCount})</Text>
                        </View>
                    </View>
                    
                    <Text className="text-gray-600 text-sm mt-1">{item.type}</Text>
                    
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-1">{item.distance} km</Text>
                        
                        <View className="ml-4 flex-row items-center">
                            <Text className="text-gray-500 text-sm">
                                {item.price === '$' ? 'Budget-friendly' : 
                                 item.price === '$$' ? 'Moderate' : 
                                 item.price === '$$$' ? 'Expensive' : 'Premium'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderPlaceItem = ({ item }: { item: any }) => (
        <PlacesPreviewCard id={item._id} name={item.name} description={item.address} image={item.images?.[0]} />
    );

    // Calculate place count
    const nearbyPlaceCount = places.length;

    return (
        <View className="flex-1 bg-[#f3f7fa]">
           
            {/* Fixed Header with Search Bar */}
            <View className="absolute  left-0 right-0 bg-[#f3f7fa] z-10 pt-12 pb-4 px-5">
                 <View className="mb-6 border-red-500">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-3xl font-bold text-gray-900">Explore</Text>
                                <Text className="text-gray-500 text-base">Discover your City like never before</Text>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name="filter-outline" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    </View>
                {/* Search Bar with Back Button when searching */}
                <View className="w-full flex-row items-center">
                    {showSearchResults && (
                        <TouchableOpacity 
                            onPress={clearSearch}
                            className="mr-3"
                        >
                            <Ionicons name="arrow-back" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    )}
                    <View className="flex-1 bg-gray-50 border border-gray-200 flex-row items-center p-4 rounded-3xl">
                        <Ionicons name="search" size={22} color="#9ca3af" style={{ marginRight: 12 }} />
                        <TextInput
                            placeholder="Search cities, spots, or things to do…"
                            placeholderTextColor="#9ca3af"
                            className="flex-1 text-base text-gray-900"
                            style={{ paddingVertical: 0 }}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onSubmitEditing={() => handleSearch(searchQuery)}
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
                
                {/* Category Tabs - Always visible */}
                <View className="mt-4">
                    <FlatList
                        data={categoriesTab}
                        renderItem={renderCategoryItem}
                        horizontal
                        keyExtractor={(item) => item.name}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    />
                </View>
            </View>

            {/* Scrollable Content Area */}
            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                    paddingTop: 160, // Adjust based on header height
                    paddingBottom: 80,
                    paddingHorizontal: 20
                }}
            >
                

                {/* Show search results OR normal explore content */}
                {showSearchResults ? (
                    <>
                        {/* Search Results Header */}
                        <View className="mt-24">
                            <Text className="text-2xl font-bold text-gray-900">
                                Found {searchResults.length} places for "{searchQuery}"
                            </Text>
                        </View>

                        {/* Search Results List */}
                        {isSearching ? (
                            <View className="py-8">
                                <Text className="text-center text-gray-500">Searching...</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <FlatList
                                data={searchResults}
                                renderItem={renderSearchResultItem}
                                keyExtractor={(item) => item._id}
                                scrollEnabled={false}
                                contentContainerStyle={{ gap: 12 }}
                            />
                        ) : (
                            <View className="bg-gray-50 rounded-xl p-8 items-center">
                                <Ionicons name="search-outline" size={48} color="#9ca3af" />
                                <Text className="text-gray-700 mt-4 text-lg font-medium">No results found</Text>
                                <Text className="text-gray-500 mt-2 text-center">
                                    Try searching for something else
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {/* Normal Explore Content */}
                        
                        {/* What's Hot Section */}
                        <View className='mt-24'>

                        <TrendingList data={trendingData}  />
                        </View>

                        
                        {/* Nearby Preview Section */}
                        <NearbyPreview 
                            placeCount={nearbyPlaceCount}
                            onOpenMap={() => setShowMapModal(true)}
                        />
                        
                        {/* Hidden Gems Section */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View>
                                <Text className="text-xl font-bold text-gray-900">Off the beaten path</Text>
                                <Text className="text-gray-500">Hidden gems waiting for you</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-blue-500 font-medium">See all</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <TrendingList data={trendingData} listVariant="compact" />
                        
                        {/* Places List */}
                        <View className="mb-6">
                            {loading ? (
                                <Text className="text-center text-gray-500 py-8">Loading places...</Text>
                            ) : places.length > 0 ? (
                                <FlatList
                                    data={places}
                                    renderItem={renderPlaceItem}
                                    keyExtractor={(item) => item._id}
                                    scrollEnabled={false}
                                    contentContainerStyle={{ gap: 16 }}
                                />
                            ) : (
                                <View className="bg-gray-50 rounded-xl p-8 items-center">
                                    <Ionicons name="location-outline" size={48} color="#9ca3af" />
                                    <Text className="text-gray-500 mt-4 text-center">
                                        No places found. Check back later!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Map Modal */}
            <Modal
                visible={showMapModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1">
                    {/* Modal Header */}
                    <View className="bg-white px-5 py-4 flex-row justify-between items-center border-b border-gray-200">
                        <Text className="text-xl font-bold text-gray-900">Interactive Map</Text>
                        <TouchableOpacity 
                            onPress={() => setShowMapModal(false)}
                            className="p-2"
                        >
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Map View */}
                    <LiveMap location={location} loading={loadingLocation} error={errorMsg} />
                </View>
            </Modal>

            {/* AI Assistant Button */}
            <View className='absolute bottom-72 right-5'>
                <TouchableOpacity onPress={()=>router.push('/bot/botchat')}>
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
        </View>
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

export default Explore;