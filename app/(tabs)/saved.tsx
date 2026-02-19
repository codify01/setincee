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
import { LinearGradient } from 'expo-linear-gradient';
import AiIcon from '../../assets/icons/ai.svg';
import Collections from '@/components/savedComponent/Collections';
import { useSavedTabData } from '@/hooks/useSavedTabData';

interface CollectionItem {
    id: string;
    name: string;
    placesCount: number;
    color: string;
}

// Mock collections data
const mockCollections: CollectionItem[] = [
    { id: '1', name: 'Must Try Foods', placesCount: 2, color: '#f97316' },
    { id: '2', name: 'Weekend Escapes', placesCount: 1, color: '#3b82f6' },
    { id: '3', name: 'Cultural Spots', placesCount: 1, color: '#8b5cf6' },
    { id: '4', name: 'Date Night', placesCount: 2, color: '#ec4899' },
    { id: '5', name: 'Adventure List', placesCount: 1, color: '#10b981' },
];

const categoriesTab = [
    { name: 'All', icon: '🔍', value: 'all' },
    { name: 'Food', icon: '🍽️', value: 'restaurant' },
    { name: 'Nature', icon: '🌿', value: 'nature' },
    { name: 'Culture', icon: '🏛️', value: 'culture' },
    { name: 'Nightlife', icon: '🌙', value: 'nightlife' },
];

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
        address: 'Lagos, Nigeria',
        collections: ['Must Try Foods']
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
        address: 'Lekki, Lagos',
        collections: ['Weekend Escapes']
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
        address: 'Lekki, Lagos',
        collections: ['Cultural Spots']
    },
    {
        _id: '4',
        name: 'Secret Garden',
        type: 'Cafe',
        category: 'restaurant',
        rating: 4.9,
        reviewCount: 150,
        distance: 3.2,
        price: '$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Victoria Island, Lagos',
        collections: ['Must Try Foods']
    },
    {
        _id: '5',
        name: 'La Taverna',
        type: 'Italian Restaurant',
        category: 'restaurant',
        rating: 4.8,
        reviewCount: 100,
        distance: 1.8,
        price: '$$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Ikoyi, Lagos',
        collections: ['Date Night']
    },
    {
        _id: '6',
        name: 'Mountain Peak Hike',
        type: 'Hiking Trail',
        category: 'nature',
        rating: 4.7,
        reviewCount: 80,
        distance: 12.5,
        price: '$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg',
        address: 'Obudu, Cross River',
        collections: ['Adventure List']
    },
    {
        _id: '7',
        name: 'Rooftop Terrace',
        type: 'Bar & Lounge',
        category: 'nightlife',
        rating: 4.8,
        reviewCount: 200,
        distance: 2.6,
        price: '$$$',
        image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
        address: 'Victoria Island, Lagos',
        collections: ['Date Night']
    },
];

const Saved: React.FC = () => {
    const { data: savedData, loading: savedLoading, error, refetch } = useSavedTabData();
    
    // Console.log saved data
    console.log('Saved Data:', savedData);
    console.log('Saved Loading:', savedLoading);
    console.log('Saved Error:', error);

    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

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
            setSelectedCollection(null); // Clear selected collection when search is cleared
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
        setSelectedCollection(null); // Clear selected collection when search is cleared
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setSelectedCollection(null); // Clear selected collection when category is selected
        
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

    const handleCollectionSelect = (collectionName: string | null) => {
        setSelectedCollection(collectionName);
        setSelectedCategory('All'); // Clear category selection when a collection is selected
        setSearchQuery(''); // Clear search query when a collection is selected
        setShowSearchResults(false);
    };

    const displayedPlaces = selectedCollection
        ? mockSearchResults.filter(place => place.collections && place.collections.includes(selectedCollection))
        : mockSearchResults; // Fallback to mockSearchResults if no collection is selected


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
                    {item.collections && item.collections.length > 0 && (
                        <View className="flex-row flex-wrap mt-2">
                            {item.collections.map((collection: string) => (
                                <View 
                                    key={collection} 
                                    className="flex-row items-center rounded-full px-3 py-1 bg-blue-50 mr-2 mb-2"
                                >
                                    <Ionicons name="bookmark-outline" size={12} color="#3b82f6" />
                                    <Text className="text-blue-600 text-xs ml-1">{collection}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderPlaceItem = ({ item }: { item: any }) => (
        <PlacesPreviewCard 
            id={item._id} 
            name={item.name} 
            description={item.address} 
            image={item.images?.[0]} 
            collections={item.collections} // Pass collections prop
            onPress={() => {
                // Navigate to create trip with place data
                router.push({
                    pathname: '/create-trip',
                    params: {
                        placeId: item._id,
                        placeName: item.name,
                        placeAddress: item.address,
                        placeImage: item.images?.[0]
                    }
                });
            }}
        />
    );


    return (
        <View className="flex-1 bg-[#f3f7fa]">
            {/* Fixed Header with Search Bar */}
            <View className="absolute  left-0 right-0 bg-[#f3f7fa] z-10 pt-12 pb-4 px-5">
                 <View className="mb-6 border-red-500">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-3xl font-bold text-gray-900">Saved</Text>
                                <Text className="text-gray-500 text-base">8 places . 5 collections</Text>
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
            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                    paddingTop: 160, 
                    paddingBottom: 80,
                    paddingHorizontal: 20
                }}
            >
                {/* Collections Section */}
                <View className="mt-24">
                    <Collections
                        collections={mockCollections}
                        selectedCollection={selectedCollection}
                        onSelectCollection={handleCollectionSelect}
                    />
                </View>

                {/* Showing Collection Bar */}
                {selectedCollection && (
                    <View className="flex-row items-center justify-between bg-blue-100 rounded-xl p-3 mt-4 mb-6">
                        <Text className="text-blue-800 font-semibold">Showing: {selectedCollection}</Text>
                        <TouchableOpacity onPress={() => handleCollectionSelect(null)}>
                            <Ionicons name="close-circle" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Show search results OR normal explore content */}
                {showSearchResults ? (
                    <>
                        {/* Search Results Header */}
                        <View className="mt-4">
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
                                  
                        {/* Places List */}
                        <View className="my-6">
                            {loading ? (
                                <Text className="text-center text-gray-500 py-8">Loading places...</Text>
                            ) : displayedPlaces.length > 0 ? (
                                <FlatList
                                    data={displayedPlaces}
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

export default Saved;
