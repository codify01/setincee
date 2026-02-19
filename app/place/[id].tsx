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
	Linking,
	Platform,
	ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPlaceById } from '@/utils/axiosIntances';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlaceDetailsSkeleton from '@/components/skeletons/PlaceDetailsSkeleton';
// import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for the specific restaurant
const restaurantData = {
	_id: '1',
	name: 'Jollof Junction',
	type: 'Nigerian Cuisine',
	rating: 4.9,
	reviewCount: 324,
	distance: 2.1,
	image:
		'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg',
	address: '123 Victoria Island, Lagos, Nigeria',
	phone: '+234 1234567890',
	hours: '10:00AM-10:00PM',
	about:
		"Experience authentic cuisine and vibrant atmosphere at one of Lagos's most beloved destinations. Perfect for family gatherings, romantic dinners, or casual meetups with friends.",
	amenities: [
		'Free WiFi',
		'Outdoor Seating',
		'Parking Available',
		'Kid-Friendly',
	],
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
		helpful: 12,
	},
	{
		id: '2',
		author: 'Chidi Okafor',
		rating: 1,
		ratingNumber: 4,
		date: '1 week ago',
		text: 'Great place for family dinners. Service was excellent and prices are reasonable.',
		helpful: 8,
	},
	{
		id: '3',
		author: 'Tunde Bakare',
		rating: 1,
		ratingNumber: 5,
		date: '3 weeks ago',
		text: 'Fantastic ambiance and top-notch service. The grilled fish was perfectly seasoned!',
		helpful: 6,
	},
	{
		id: '4',
		author: 'Grace Eze',
		rating: 1,
		ratingNumber: 4,
		date: '1 month ago',
		text: 'Lovely place! A bit crowded on weekends but totally worth the wait. Will definitely come back.',
		helpful: 10,
	},
];

const PlaceDetailsScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
	const [isSaved, setIsSaved] = useState(false);
	const [activeTab, setActiveTab] = useState('Overview');
	const [reviewTitle, setReviewTitle] = useState('');
	const [reviewText, setReviewText] = useState('');
	const [visitDate, setVisitDate] = useState('');
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showDirectionsModal, setShowDirectionsModal] = useState(false);
	const [directionsLoading, setDirectionsLoading] = useState(false);
	const [directionsError, setDirectionsError] = useState<string | null>(null);
	const [routeCoords, setRouteCoords] = useState<
		Array<{ latitude: number; longitude: number }>
	>([]);
	const [userCoords, setUserCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [userRating, setUserRating] = useState(0);
	const [place, setPlace] = useState<any>(null);
	const [loadingPlace, setLoadingPlace] = useState(true);

	const HERO_HEIGHT = 360;

	const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
	const mapboxTileUrl = mapboxToken
		? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`
		: null;

	const getPlaceCoords = () => {
		const lat =
			place?.location?.latitude ??
			place?.latitude ??
			place?.lat ??
			(place?.location?.coordinates ? place.location.coordinates[1] : undefined);
		const lng =
			place?.location?.longitude ??
			place?.longitude ??
			place?.lng ??
			(place?.location?.coordinates ? place.location.coordinates[0] : undefined);
		const latitude = Number(lat);
		const longitude = Number(lng);
		if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
			return { latitude, longitude };
		}
		return null;
	};

	const placeCoords = getPlaceCoords();
	const latitude = placeCoords?.latitude ?? NaN;
	const longitude = placeCoords?.longitude ?? NaN;
	const hasCoords = !!placeCoords;

	const openDirections = () => {
		if (!hasCoords) return;
		const destination = `${latitude},${longitude}`;
		const label = encodeURIComponent(place?.name ?? 'Destination');
		const url =
			Platform.OS === 'ios'
				? `https://maps.apple.com/?daddr=${destination}&q=${label}`
				: `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
		Linking.openURL(url).catch((err) =>
			console.error('Failed to open maps app:', err),
		);
	};

	const openDirectionsModal = async () => {
		if (!hasCoords) return;
		if (!mapboxToken) {
			setDirectionsError('Missing Mapbox token.');
			setShowDirectionsModal(true);
			return;
		}

		setDirectionsError(null);
		setDirectionsLoading(true);
		setShowDirectionsModal(true);

		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setDirectionsError('Location permission denied.');
				setDirectionsLoading(false);
				return;
			}

			const current = await Location.getCurrentPositionAsync({});
			const origin = {
				latitude: current.coords.latitude,
				longitude: current.coords.longitude,
			};
			setUserCoords(origin);

			const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${longitude},${latitude}?geometries=geojson&overview=full&access_token=${mapboxToken}`;
			const res = await fetch(url);
			const data = await res.json();

			const coords = data?.routes?.[0]?.geometry?.coordinates;
			if (!coords || !Array.isArray(coords)) {
				throw new Error('No route found');
			}

			const polylineCoords = coords.map((c: [number, number]) => ({
				longitude: c[0],
				latitude: c[1],
			}));
			setRouteCoords(polylineCoords);
		} catch (e) {
			console.error('Directions error:', e);
			setDirectionsError('Failed to load directions.');
		} finally {
			setDirectionsLoading(false);
		}
	};
	useEffect(() => {
		const fetchPlaceDetails = async () => {
			setLoadingPlace(true);
			try {
				const response = await getPlaceById(id as string);
				if (!response || !response.data || !response.data.data) {
					throw new Error('Invalid response structure');
				}
				const data = response.data.data;
				setPlace(data);
			} catch (error) {
				console.error('Error fetching place details:', error);
			} finally {
				setLoadingPlace(false);
			}
		};
		fetchPlaceDetails();
	}, [id]);

	const tabs = ['Overview', 'Reviews', 'Photos'];

	const renderStars = (rating: number) => {
		return (
			<View className="flex-row">
				{Array.from({ length: 5 }).map((_, i) => (
					<Ionicons key={i} name="star" size={16} color="#f59e0b" />
				))}
			</View>
		);
	};

	const renderReviewItem = ({ item }: { item: any }) => (
		<View className="mb-6 pb-6 border-b border-gray-100 ">
			<View className="flex-row justify-between items-start mb-2">
				<View className="flex-row gap-2">
					<View className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center">
						<Text className="font-bold text-white text-center text-xl">U</Text>
					</View>
					<View className="mt-1">
						<Text className="font-bold text-gray-900 text-xl">
							{item.author}
						</Text>
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
					<Text className="text-gray-500 text-sm">
						Helpful ({item.helpful})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text className="text-gray-500 text-sm">Reply</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderOverviewTab = () => (
		<View className="px-5 bg-white">
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
							<Text className="text-gray-700 text-sm font-medium">
								{amenity}
							</Text>
						</View>
					))}
				</View>
			</View>

			{/* Location */}
			<View className="mb-8">
				<Text className="text-xl font-bold text-gray-900 mb-3">Location</Text>
				<Text className="text-gray-700 mb-2">{place?.address}</Text>
				{hasCoords ? (
					<View className="h-48 rounded-xl overflow-hidden border border-neutral-200">
						<MapView
							style={{ flex: 1 }}
							mapType="none"
							initialRegion={{
								latitude,
								longitude,
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}}
						>
							{mapboxTileUrl ? (
								<UrlTile
									urlTemplate={mapboxTileUrl}
									maximumZ={19}
									tileSize={256}
								/>
							) : null}
							<Marker
								coordinate={{ latitude, longitude }}
								title={place?.name ?? 'Location'}
							/>
						</MapView>
					</View>
				) : (
					<Text className="text-sm text-red-500">
						Location coordinates unavailable.
					</Text>
				)}
				{/* {hasCoords ? (
                    <TouchableOpacity
                        onPress={openDirections}
                        className="mt-3 flex-row items-center"
                    >
                        <Ionicons name="navigate-outline" size={18} color="#3b82f6" style={{ marginRight: 6 }} />
                        <Text className="text-blue-500 font-medium">Get Directions</Text>
                    </TouchableOpacity>
                ) : null} */}
				{hasCoords ? (
					<TouchableOpacity
						onPress={openDirectionsModal}
						className="mt-2 flex-row items-center"
					>
						<Ionicons
							name="map-outline"
							size={18}
							color="#3b82f6"
							style={{ marginRight: 6 }}
						/>
						<Text className="text-blue-500 font-medium">Get Directions</Text>
					</TouchableOpacity>
				) : null}
				{!mapboxTileUrl ? (
					<Text className="text-xs text-neutral-600 mt-2">
						Missing EXPO_PUBLIC_MAPBOX_TOKEN in .env
					</Text>
				) : null}
			</View>

			{/* Action Buttons */}

			<View className=" mb-8">
				<Text className="text-black font-semibold text-start">Contact</Text>
				<View className="flex-row gap-3">
					<Ionicons name="call-outline" size={20} color="#000" className="" />
					<Text className="text-black  text-start">
						{place?.contactInfo?.phone}
					</Text>
				</View>
				<View className="flex-row gap-3">
					<Ionicons name="time-outline" size={20} color="#000" className="" />
					<Text className="text-black  text-start">{place?.openingHours}</Text>
				</View>
			</View>
			<View className="flex-row gap-3 my-8">
				<TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-lg">
					<Text className="text-white font-semibold text-center">
						+ Add a Trip
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderWriteReviewTab = () => (
		<ScrollView className="px-5" showsVerticalScrollIndicator={false}>
			<Text className="text-2xl font-bold text-gray-900 mb-6">
				Write a Review
			</Text>

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
								name={i < userRating ? 'star' : 'star-outline'}
								size={40}
								color={i < userRating ? '#f59e0b' : '#d1d5db'}
							/>
						</TouchableOpacity>
					))}
				</View>
				{userRating > 0 && (
					<Text className="text-center text-gray-600 text-sm">
						{userRating} out of 5 stars
					</Text>
				)}
			</View>

			{/* Review Title */}
			<View className="mb-6">
				<Text className="text-gray-700 mb-2 font-semibold">
					Review Title (Optional)
				</Text>
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
				<Text className="text-gray-400 text-sm text-right mt-1">
					{reviewText.length}/500 characters
				</Text>
			</View>

			{/* Visit Date */}
			<View className="mb-6">
				<Text className="text-gray-700 mb-2 font-semibold">
					When did you visit? (Optional)
				</Text>
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
				<Text className="text-gray-700 mb-3 font-semibold">
					Add Photos (Optional)
				</Text>
				<Text className="text-gray-500 text-sm mb-3">
					Help others see what to expect
				</Text>
				<TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg py-8 items-center justify-center">
					<Ionicons name="camera-outline" size={32} color="#9ca3af" />
					<Text className="text-gray-500 mt-2">Add photos</Text>
				</TouchableOpacity>
			</View>

			{/* Writing Tips */}
			<View className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
				<Text className="font-bold text-gray-900 mb-3">Writing Tips</Text>
				<View className="space-y-2">
					<Text className="text-gray-700 text-sm">
						• Be specific about what you liked or didn't like
					</Text>
					<Text className="text-gray-700 text-sm">
						• Mention the atmosphere, service, and value
					</Text>
					<Text className="text-gray-700 text-sm">
						• Keep it helpful and respectful
					</Text>
					<Text className="text-gray-700 text-sm">
						• Add photos to make your review more useful
					</Text>
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
						<View className="">
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
							<Text className="text-lg font-bold text-gray-900">
								{restaurantData.name}
							</Text>
							<Text className="text-gray-600 mt-1">{restaurantData.type}</Text>
						</View>
					</View>

					{/* Modal Content */}
					<View className="px-5 py-6">
						{/* Tap to rate section */}
						<View className="mb-8">
							<Text className="text-gray-700 mb-4 font-semibold">
								Your Rating
							</Text>
							<View className="flex-row gap-2 justify-center mb-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => setUserRating(i + 1)}
										className="p-2"
									>
										<Ionicons
											name={i < userRating ? 'star' : 'star-outline'}
											size={40}
											color={i < userRating ? '#f59e0b' : '#d1d5db'}
										/>
									</TouchableOpacity>
								))}
							</View>
							{userRating > 0 && (
								<Text className="text-center text-gray-600 text-sm">
									{userRating} out of 5 stars
								</Text>
							)}
						</View>

						{/* Review Title */}
						<View className="mb-6">
							<Text className="text-gray-700 mb-2 font-semibold">
								Review Title (Optional)
							</Text>
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
							<Text className="text-gray-700 mb-2 font-semibold">
								Your Review
							</Text>
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
							<Text className="text-gray-400 text-sm text-right mt-1">
								{reviewText.length}/500 characters
							</Text>
						</View>

						{/* Visit Date */}
						<View className="mb-6">
							<Text className="text-gray-700 mb-2 font-semibold">
								When did you visit? (Optional)
							</Text>
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
							<Text className="text-gray-700 mb-3 font-semibold">
								Add Photos (Optional)
							</Text>
							<Text className="text-gray-500 text-sm mb-3">
								Help others see what to expect
							</Text>
							<TouchableOpacity className="border-2 w-36 border-dashed border-gray-300 rounded-lg py-8 items-center justify-center">
								<Ionicons name="camera-outline" size={32} color="#9ca3af" />
								<Text className="text-gray-500 mt-2">Add photos</Text>
							</TouchableOpacity>
						</View>

						{/* Writing Tips */}
						<View className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4  border-blue-500">
							<Text className="font-bold text-gray-900 mb-3">Writing Tips</Text>
							<View className="space-y-2">
								<Text className="text-gray-700 text-sm">
									• Be specific about what you liked or didn't like
								</Text>
								<Text className="text-gray-700 text-sm">
									• Mention the atmosphere, service, and value
								</Text>
								<Text className="text-gray-700 text-sm">
									• Keep it helpful and respectful
								</Text>
								<Text className="text-gray-700 text-sm">
									• Add photos to make your review more useful
								</Text>
							</View>
						</View>

						{/* Action Buttons */}
						<View className="flex-row gap-3 mb-10">
							<TouchableOpacity
								className="flex-1 bg-gray-200 py-4 rounded-lg"
								onPress={() => setShowReviewModal(false)}
							>
								<Text className="text-gray-700 font-semibold text-center">
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity className="flex-1 bg-blue-500 py-4 rounded-lg">
								<Text className="text-white font-semibold text-center">
									Submit Review
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</Modal>
	);

	const renderDirectionsModal = () => (
		<Modal
			visible={showDirectionsModal}
			animationType="slide"
			onRequestClose={() => setShowDirectionsModal(false)}
		>
			<SafeAreaView className="flex-1 bg-white">
				<View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
					<Text className="text-lg font-semibold">Directions</Text>
					<TouchableOpacity onPress={() => setShowDirectionsModal(false)}>
						<Ionicons name="close" size={24} color="#111827" />
					</TouchableOpacity>
				</View>

				{directionsLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color="#000" />
					</View>
				) : directionsError ? (
					<View className="flex-1 items-center justify-center px-6">
						<Text className="text-red-500 text-center">{directionsError}</Text>
					</View>
				) : (
					<View className="flex-1">
						<MapView
							style={{ flex: 1 }}
							mapType="none"
							initialRegion={{
								latitude: userCoords?.latitude ?? latitude,
								longitude: userCoords?.longitude ?? longitude,
								latitudeDelta: 0.05,
								longitudeDelta: 0.05,
							}}
						>
							{mapboxTileUrl ? (
								<UrlTile
									urlTemplate={mapboxTileUrl}
									maximumZ={19}
									tileSize={256}
								/>
							) : null}
							{routeCoords.length > 0 ? (
								<Polyline
									coordinates={routeCoords}
									strokeColor="#2563eb"
									strokeWidth={4}
								/>
							) : null}
							{userCoords ? (
								<Marker coordinate={userCoords} title="You" />
							) : null}
							{hasCoords ? (
								<Marker
									coordinate={{ latitude, longitude }}
									title={place?.name ?? 'Destination'}
								/>
							) : null}
						</MapView>
					</View>
				)}
			</SafeAreaView>
		</Modal>
	);

	if (loadingPlace) {
		return (
			<SafeAreaView className="flex-1 bg-white">
				<PlaceDetailsSkeleton />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Fixed Hero Image */}
			<View
				className="absolute top-0 left-0 right-0 bg-gray-200 overflow-hidden"
				style={{ height: HERO_HEIGHT }}
			>
				<Image
					source={{ uri: place?.images?.[0] }}
					className="w-full h-full"
					resizeMode="cover"
				/>
				<View className="absolute inset-0 bg-black/35" />
				<View className="absolute bottom-0 left-0 right-0 px-5 pb-6 z-10">
					<Text className="text-3xl font-bold text-white mb-2">
						{place?.name}
					</Text>
					<Text className="text-white/90">{place?.category}</Text>
				</View>
				{hasCoords ? (
					<TouchableOpacity
						onPress={openDirectionsModal}
						className="absolute bottom-6 right-5 bg-white/90 px-3 py-2 rounded-full flex-row items-center"
					>
						<Ionicons name="map-outline" size={18} color="#2563eb" style={{ marginRight: 6 }} />
						<Text className="text-blue-600 font-medium">Directions</Text>
					</TouchableOpacity>
				) : null}
			</View>

			{/* Floating Header Actions */}
            <View
                className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-5 py-4 z-20"
                style={{ paddingTop: (insets?.top ?? 0) + 8 }}
            >
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
						name={isSaved ? 'heart' : 'heart-outline'}
						size={24}
						color={isSaved ? '#ef4444' : '#6b7280'}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				className="flex-1 "
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: HERO_HEIGHT }}
				stickyHeaderIndices={[0]}
			>
				{/* Sticky Tabs */}
				<View className="bg-white border-b border-gray-100">
					<View className="flex-row">
						{tabs.map((tab) => (
							<TouchableOpacity
								key={tab}
								className={`flex-1 py-4 pl-4 items-start ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
								onPress={() => setActiveTab(tab)}
							>
								<Text
									className={`font-medium ${activeTab === tab ? 'text-blue-500' : 'text-gray-500'}`}
								>
									{tab}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Rating and Distance */}
				<View className="flex-row items-center justify-between py-4 px-5 bg-white">
					<View className="flex-row items-center">
						<Text className="text-3xl font-bold text-gray-900 mr-2">
							{restaurantData.rating}
						</Text>
						<View>
							<View className="flex-row items-center mb-1">
								{renderStars(restaurantData.rating)}
							</View>
							<Text className="text-gray-500 text-sm">
								({restaurantData.reviewCount} reviews)
							</Text>
						</View>
					</View>
					<Text className="text-gray-500">{restaurantData.distance}km</Text>
				</View>
				<View className=" flex-row justify-between px-5 bg-white">
					{/* Hours Status */}
					<View className="mb-6 leading-6 items-center">
						<Ionicons
							name="time-outline"
							size={24}
							color="#155dfc"
							className="p-4  rounded-full bg-[#eff6ff]"
						/>
						<Text className="text-gray-700 font-medium py-2">Hours</Text>

						<Text className="text-green-600 font-medium text-sm">Open Now</Text>
					</View>

					{/* Price */}
					<View className="mb-6">
						<Text className="text-[#00a63e] text-[24px] p-4 w-14 h-14 text-center rounded-full bg-[#eff6ff] font-medium">
							₦
						</Text>

						<Text className="text-gray-700 text-center font-medium py-2">
							Price
						</Text>

						<Text className="text-blue-600 text-center font-medium text-sm">
							{place?.entryFee.split(',').join('\n')}
						</Text>
					</View>

					{/* Contact */}
					<View className="mb-8  items-center">
						<Ionicons
							name="call-outline"
							size={24}
							color="#9810fa"
							className="p-4  rounded-full bg-[#faf5ff]"
						/>
						<Text className="text-gray-700 text-center font-medium py-2">
							Contact
						</Text>
						<Text className="text-gray-600 text-center">Available</Text>
					</View>
				</View>

				{/* Tab Content */}
				{activeTab === 'Overview' && renderOverviewTab()}
				{activeTab === 'Reviews' && (
					<View className="px-5 bg-white">
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
											<Text className="text-4xl font-bold text-gray-900 mr-3">
												{restaurantData.rating}
											</Text>
											<View className="flex-row items-center mb-1">
												{renderStars(restaurantData.rating)}
											</View>
											<Text className="text-gray-500">
												({restaurantData.reviewCount} reviews)
											</Text>
										</View>
										<View>
											{/* styling start */}
											<Image
												source={require('@/assets/images/Container.png')}
												className="w-full h-48"
												resizeMode="cover"
												alt="rate_image"
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
								<Text className="text-blue-500 font-semibold text-center">
									+ Write a Review
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				{activeTab === 'Photos' && (
					<View className="px-3 py-4 bg-white">
						<Text className="text-xl font-bold text-gray-900 mb-4 px-2">
							Photos
						</Text>
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
			{renderDirectionsModal()}
		</SafeAreaView>
	);
};

export default PlaceDetailsScreen;
