import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput,
    Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPlaceById } from '@/utils/axiosIntances';

// Mock data for the specific restaurant
const restaurantData = {
    _id: '1',
    name: 'Jollof Junction',
    type: 'Nigerian Cuisine',
    rating: 4.9,
    reviewCount: 324,
    distance: 2.1,
    image: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
    address: '123 Victoria Island, Lagos, Nigeria',
    phone: '+234 1234567890',
    hours: '10:00AM-10:00PM',
    about: 'Experience authentic cuisine and vibrant atmosphere at one of Lagos\'s most beloved destinations. Perfect for family gatherings, romantic dinners, or casual meetups with friends.',
    amenities: ['Free WiFi', 'Outdoor Seating', 'Parking Available', 'Kid-Friendly']
};

// Mock reviews matching the image
const mockReviews = [
    {
        id: '1',
        author: 'Amara Johnson',
        rating: 1,
        ratingNumber: 5,
        date: '2 days ago',
        text: 'Amazing experience! The food was delicious and the atmosphere was perfect. Highly recommend!',
        helpful: 12
    },
    {
        id: '2',
        author: 'Chidi Okafor',
        rating: 1,
        ratingNumber: 4,
        date: '1 week ago',
        text: 'Great place for family dinners. Service was excellent and prices are reasonable.',
        helpful: 8
    },
    {
        id: '3',
        author: 'Tunde Bakare',
        rating: 1,
        ratingNumber: 5,
        date: '3 weeks ago',
        text: 'Fantastic ambiance and top-notch service. The grilled fish was perfectly seasoned!',
        helpful: 6
    },
    {
        id: '4',
        author: 'Grace Eze',
        rating: 1,
        ratingNumber: 4,
        date: '1 month ago',
        text: 'Lovely place! A bit crowded on weekends but totally worth the wait. Will definitely come back.',
        helpful: 10
    },
];

const PlaceDetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [place, setPlace] = useState<any>(null);

    useEffect(()=>{
            const fetchPlaceDetails = async () =>{
                try {
                    const response = await getPlaceById(id as string);
                    if (!response || !response.data || !response.data.data) {
                        throw new Error('Invalid response structure');
                    }
                    const data = response.data.data;
                    setPlace(data);
                } catch (error) {
                    console.error('Error fetching place details:', error);
                }
            }
            fetchPlaceDetails();
        },[id, place])

    const tabs = ['Overview', 'Reviews', 'Photos'];
    

    const renderStars = (rating: number) => {
        return (
            <View className="flex-row">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color="#f59e0b"
                    />
                ))}
            </View>
        );
    };

    const renderReviewItem = ({ item }: { item: any }) => (
        <View className="mb-6 pb-6 border-b border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
                <View className='flex-row gap-2'>
                    <View className='bg-blue-500 w-12 h-12 rounded-full items-center justify-center'>
                        <Text className="font-bold text-white text-center text-xl">U</Text>
                    </View>
                    <View className='mt-1'>

                <Text className="font-bold text-gray-900 text-xl">{item.author}</Text>
                <Text className="text-gray-500 text-sm">{item.date}</Text>
                    </View>
                </View>
            <View className="flex-row items-center bg-[#fefce8] rounded-2xl p-2 mb-2">
                <Text>{item.ratingNumber}</Text>
                <Ionicons name="star" size={16} color="#f0b100" className="ml-2" />
            </View>
            </View>
            <Text className="text-gray-700 text-md mb-3">{item.text}</Text>
            <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center mr-4">
                    <Text className="text-gray-500 text-sm">Helpful ({item.helpful})</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-gray-500 text-sm">Reply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderOverviewTab = () => (
        <View className="px-5">
          

            {/* About Section */}
            <View className="mb-8">
                <Text className="text-xl font-bold text-gray-900 my-3">About</Text>
                <Text className="text-gray-700 leading-6">{place?.description}</Text>
            </View>

            {/* Amenities Section */}
            <View className="mb-8">
                <Text className="text-xl font-bold text-gray-900 mb-3">Amenities</Text>
                <View className="flex-row flex-wrap gap-2">
                    {restaurantData.amenities.map((amenity, idx) => (
                        <View key={idx} className="bg-gray-100 px-4 py-2 rounded-full">
                            <Text className="text-gray-700 text-sm font-medium">{amenity}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Location */}
            <View className="mb-8">
                <Text className="text-xl font-bold text-gray-900 mb-3">Location</Text>
                <Text className="text-gray-700 mb-2">{place?.address}</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="map-outline" size={18} color="#3b82f6" style={{ marginRight: 6 }} />
                    <Text className="text-blue-500 font-medium">Map View</Text>
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
   
            <View className=" mb-8">
                    <Text className="text-black font-semibold text-start">Contact</Text>
                    <View className='flex-row gap-3'>
                    <Ionicons name="call-outline" size={20} color="#000" className=''  />
                    <Text className="text-black  text-start">{place?.contactInfo?.phone}</Text>
                    </View>
                    <View className='flex-row gap-3'>
                     <Ionicons name="time-outline" size={20} color="#000" className='' />
                    <Text className="text-black  text-start">{place?.openingHours}</Text>
                    </View>
            </View>
            <View className="flex-row gap-3 my-8">
                <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-lg">
                    <Text className="text-white font-semibold text-center">+ Add a Trip</Text>
                </TouchableOpacity>

            </View>
        </View>
    );

    const renderWriteReviewTab = () => (
        <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
            <Text className="text-2xl font-bold text-gray-900 mb-6">Write a Review</Text>
            
            {/* Tap to rate section */}
            <View className="mb-8">
                <Text className="text-gray-700 mb-4 font-semibold">Your Rating</Text>
                <View className="flex-row gap-2 justify-center mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TouchableOpacity 
                            key={i} 
                            onPress={() => setUserRating(i + 1)}
                            className="p-2"
                        >
                            <Ionicons 
                                name={i < userRating ? "star" : "star-outline"} 
                                size={40} 
                                color={i < userRating ? "#f59e0b" : "#d1d5db"} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {userRating > 0 && (
                    <Text className="text-center text-gray-600 text-sm">{userRating} out of 5 stars</Text>
                )}
            </View>

            {/* Review Title */}
            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-semibold">Review Title (Optional)</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="Sum up your experience"
                    value={reviewTitle}
                    onChangeText={setReviewTitle}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            {/* Review Text */}
            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-semibold">Your Review</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-32"
                    placeholder="Share details about your experience!"
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                    numberOfLines={6}
                    placeholderTextColor="#9ca3af"
                    textAlignVertical="top"
                />
                <Text className="text-gray-400 text-sm text-right mt-1">{reviewText.length}/500 characters</Text>
            </View>

            {/* Visit Date */}
            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-semibold">When did you visit? (Optional)</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="MM/DD/YY"
                    value={visitDate}
                    onChangeText={setVisitDate}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            {/* Add Photos */}
            <View className="mb-8">
                <Text className="text-gray-700 mb-3 font-semibold">Add Photos (Optional)</Text>
                <Text className="text-gray-500 text-sm mb-3">Help others see what to expect</Text>
                <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg py-8 items-center justify-center">
                    <Ionicons name="camera-outline" size={32} color="#9ca3af" />
                    <Text className="text-gray-500 mt-2">Add photos</Text>
                </TouchableOpacity>
            </View>

            {/* Writing Tips */}
            <View className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Text className="font-bold text-gray-900 mb-3">Writing Tips</Text>
                <View className="space-y-2">
                    <Text className="text-gray-700 text-sm">• Be specific about what you liked or didn't like</Text>
                    <Text className="text-gray-700 text-sm">• Mention the atmosphere, service, and value</Text>
                    <Text className="text-gray-700 text-sm">• Keep it helpful and respectful</Text>
                    <Text className="text-gray-700 text-sm">• Add photos to make your review more useful</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderReviewModal = () => (
        <Modal
            visible={showReviewModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowReviewModal(false)}
        >
            <View className="flex-1 bg-black/50">
                <ScrollView 
                    className="flex-1 bg-white py-6 rounded-t-3xl mt-auto"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Modal Header */}
                    <View className="flex-row items-start pt-12 gap-4 px-5 py-4 border-b border-gray-100">
                        <TouchableOpacity 
                            onPress={() => setShowReviewModal(false)}
                            className="p-2 bg-[#e3e6e9] rounded-full"
                        >
                            <Ionicons name="arrow-back" size={24} color="#6b7280" />
                        </TouchableOpacity>
                        <View className=''>   
                        <Text className="text-xl font-bold">Write a Review</Text>
                        <Text className="text-md">{restaurantData.name}</Text>
                        </View>
                    </View>

                     {/* Modal Header */}
                    <View className="flex-row bg-[#e3e6e9] rounded-xl gap-5 px-5 py-4 m-5">
                        <Image
                            source={{ uri: restaurantData.image }}
                            className="w-20 h-20 rounded-md"
                            resizeMode="cover"
                        />
                        <View className="flex-1 justify-center">
                            <Text className="text-lg font-bold text-gray-900">{restaurantData.name}</Text>
                            <Text className="text-gray-600 mt-1">{restaurantData.type}</Text>
     </View>
                    </View>

                    {/* Modal Content */}
                    <View className="px-5 py-6">
                        {/* Tap to rate section */}
                        <View className="mb-8">
                            <Text className="text-gray-700 mb-4 font-semibold">Your Rating</Text>
                            <View className="flex-row gap-2 justify-center mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TouchableOpacity 
                                        key={i} 
                                        onPress={() => setUserRating(i + 1)}
                                        className="p-2"
                                    >
                                        <Ionicons 
                                            name={i < userRating ? "star" : "star-outline"} 
                                            size={40} 
                                            color={i < userRating ? "#f59e0b" : "#d1d5db"} 
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {userRating > 0 && (
                                <Text className="text-center text-gray-600 text-sm">{userRating} out of 5 stars</Text>
                            )}
                        </View>

                        {/* Review Title */}
                        <View className="mb-6">
                            <Text className="text-gray-700 mb-2 font-semibold">Review Title (Optional)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                                placeholder="Sum up your experience"
                                value={reviewTitle}
                                onChangeText={setReviewTitle}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        {/* Review Text */}
                        <View className="mb-6">
                            <Text className="text-gray-700 mb-2 font-semibold">Your Review</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-32"
                                placeholder="Share details about your experience!"
                                value={reviewText}
                                onChangeText={setReviewText}
                                multiline
                                numberOfLines={6}
                                placeholderTextColor="#9ca3af"
                                textAlignVertical="top"
                            />
                            <Text className="text-gray-400 text-sm text-right mt-1">{reviewText.length}/500 characters</Text>
                        </View>

                        {/* Visit Date */}
                        <View className="mb-6">
                            <Text className="text-gray-700 mb-2 font-semibold">When did you visit? (Optional)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                                placeholder="MM/DD/YY"
                                value={visitDate}
                                onChangeText={setVisitDate}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        {/* Add Photos */}
                        <View className="mb-8">
                            <Text className="text-gray-700 mb-3 font-semibold">Add Photos (Optional)</Text>
                            <Text className="text-gray-500 text-sm mb-3">Help others see what to expect</Text>
                            <TouchableOpacity className="border-2 w-36 border-dashed border-gray-300 rounded-lg py-8 items-center justify-center">
                                <Ionicons name="camera-outline" size={32} color="#9ca3af" />
                                <Text className="text-gray-500 mt-2">Add photos</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Writing Tips */}
                        <View className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4  border-blue-500">
                            <Text className="font-bold text-gray-900 mb-3">Writing Tips</Text>
                            <View className="space-y-2">
                                <Text className="text-gray-700 text-sm">• Be specific about what you liked or didn't like</Text>
                                <Text className="text-gray-700 text-sm">• Mention the atmosphere, service, and value</Text>
                                <Text className="text-gray-700 text-sm">• Keep it helpful and respectful</Text>
                                <Text className="text-gray-700 text-sm">• Add photos to make your review more useful</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 mb-10">
                            <TouchableOpacity 
                                className="flex-1 bg-gray-200 py-4 rounded-lg"
                                onPress={() => setShowReviewModal(false)}
                            >
                                <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-blue-500 py-4 rounded-lg">
                                <Text className="text-white font-semibold text-center">Submit Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" >
            
            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image with Overlay Content */}
                <View className="w-full h-96 bg-gray-200 overflow-hidden relative">
                    <Image
                        source={{ uri: place?.images?.[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    
                    {/* Dark Overlay for Readability */}
                    <View className="absolute inset-0 bg-black/30" />
                    
                    {/* Floating Header */}
                    <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-5 py-4 z-10">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-white/90 rounded-full p-2 shadow-md"
                        >
                            <Ionicons name="arrow-back" size={24} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsSaved(!isSaved)}
                            className="bg-white/90 rounded-full p-2 shadow-md"
                        >
                            <Ionicons 
                                name={isSaved ? "heart" : "heart-outline"} 
                                size={24} 
                                color={isSaved ? "#ef4444" : "#6b7280"} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Restaurant Name and Type Overlay */}
                    <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 z-10">
                        <Text className="text-3xl font-bold text-white mb-2">{place?.name}</Text>
                        <Text className="text-white/90">{place?.category}</Text>
                    </View>
                </View>
        {/* Rating and Distance */}
            <View className="flex-row items-center justify-between my-4 mx-5">
                <View className="flex-row items-center">
                    <Text className="text-3xl font-bold text-gray-900 mr-2">{restaurantData.rating}</Text>
                    <View>
                        <View className="flex-row items-center mb-1">
                            {renderStars(restaurantData.rating)}
                        </View>
                        <Text className="text-gray-500 text-sm">({restaurantData.reviewCount} reviews)</Text>
                    </View>
                </View>
                <Text className="text-gray-500">{restaurantData.distance}km</Text>
            </View>
            <View className=" flex-row justify-between mx-5">
            {/* Hours Status */}
            <View className="mb-6 leading-6 items-center">
                
                    <Ionicons name="time-outline" size={24} color="#155dfc" className='p-4  rounded-full bg-[#eff6ff]' />
                    <Text className="text-gray-700 font-medium py-2">Hours</Text>
  

                  
                        <Text className="text-green-600 font-medium text-sm">Open Now</Text>

  
            </View>

            {/* Price */}
            <View className="mb-6">

                    
                    <Text className="text-[#00a63e] text-[24px] p-4 w-14 h-14 text-center rounded-full bg-[#eff6ff] font-medium">₦</Text>
             
             <Text className="text-gray-700 text-center font-medium py-2">Price</Text>
             
             
                        <Text className="text-blue-600 text-center font-medium text-sm">{place?.entryFee.split(",").join("\n")}</Text>
             
           
            </View>

            {/* Contact */}
            <View className="mb-8  items-center">
                    <Ionicons name="call-outline" size={24} color="#9810fa" className='p-4  rounded-full bg-[#faf5ff]'  />
                    <Text className="text-gray-700 text-center font-medium py-2">Contact</Text>
                <Text className="text-gray-600 text-center">Available</Text>
            </View>
            </View>


                {/* Tabs */}
                <View className="flex-row border-b m-4 border-gray-100">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            className={`flex-1 py-4 pl-4 items-start ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text className={`font-medium ${activeTab === tab ? 'text-blue-500' : 'text-gray-500'}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                {activeTab === 'Overview' && renderOverviewTab()}
                {activeTab === 'Reviews' && (
                    <View className="px-5">
                        <FlatList
                            data={mockReviews}
                            renderItem={renderReviewItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ListHeaderComponent={() => (
                                <View className="py-4">
                                    <Text className="text-2xl font-bold text-gray-900 mb-1"></Text>
                                    <View className="flex-row justify-between items-center mb-6">
                                        <View>
                                        <Text className="text-4xl font-bold text-gray-900 mr-3">{restaurantData.rating}</Text>
                                            <View className="flex-row items-center mb-1">
                                                {renderStars(restaurantData.rating)}
                                            </View>
                                            <Text className="text-gray-500">({restaurantData.reviewCount} reviews)</Text>
                                        </View>
                                        <View>
                                        {/* styling start */}
                                        <Image
                                        source={require('@/assets/images/Container.png')}
                                        className="w-full h-48"
                                        resizeMode="cover"
                                        alt='rate_image'
                                    />
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                           <View className="flex-row gap-3 my-8">
                <TouchableOpacity 
                    className="flex-1 border border-blue-500 bg-transparent py-5 rounded-lg"
                    onPress={() => setShowReviewModal(true)}
                >
                    <Text className="text-blue-500 font-semibold text-center">+ Write a Review</Text>
                </TouchableOpacity>

            </View>
                    </View>
                )}
                {activeTab === 'Photos' && (
    <View className="px-3 py-4">
        <Text className="text-xl font-bold text-gray-900 mb-4 px-2">Photos</Text>
        <View className="flex-row flex-wrap justify-between">
            {place?.images?.map((image, index) => (
                <TouchableOpacity 
                    key={index} 
                    className="w-[48%] mb-3 bg-gray-100 rounded-lg overflow-hidden aspect-square"
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            ))}
        </View>
    </View>
)}
            </ScrollView>

            {/* Review Modal */}
            {renderReviewModal()}
        </SafeAreaView>
    );
};

export default PlaceDetailsScreen;