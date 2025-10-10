import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ImageBackground,
	Image,
	TouchableOpacity,
	ScrollView,
    Pressable,
	ActivityIndicator,
	FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { getPlaceById } from '@/utils/axiosIntances';
import MapView, { Marker } from 'react-native-maps';

const tabs = ['Overview', 'Maps', 'Preview'];

// Define the type for the place data
export interface Place {
	_id: string;
	name: string;
	description: string;
	entryFee: string;
	address: string;
	location: {
		latitude: number;
		longitude: number;
	};
	images: string[];
}

const PlaceDetailsScreen: React.FC = () => {
	const {id} = useLocalSearchParams()
	const [activeTab, setActiveTab] = useState<string>('Overview');
	const [place, setPlace] = useState<any>(null)
	const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

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

	// Calculate top padding based on platform
	const renderTabContent = () => {
		switch (activeTab) {
			case 'Overview':
				return (
					<Text className="text-grey text-base mt-2">
						{place?.description || 'No description available.'}
					</Text>
				);
			case 'Maps':
				return (
					<View className="">
				<View className="h-72 rounded-xl overflow-hidden border border-neutral-300">
					{loadingLocation ? (
						<ActivityIndicator size="large" color="#000" />
					) : location ? (
						<MapView
							style={{ flex: 1 }}
							initialRegion={{
								latitude: place.location.latitude,
								longitude: place.location.longitude,
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}}
						>
							<Marker coordinate={{ latitude: place.location.latitude, longitude: place.location.longitude }} title="You are here" />
						</MapView>
					) : (
						// <Text className="text-center mt-4 text-red-500">{errorMsg}</Text>
						<Text className="text-center mt-4 text-red-500">Error occured</Text>
					)}
				</View>
			</View>
				);
			case 'Preview':
				return (
					<View className="flex-row mt-2 gap-2">
						<Image
							source={require('../../../assets/images/splash/page1.png')}
							className="w-24 h-24 rounded-lg"
						/>
						<Image
							source={require('../../../assets/images/splash/page1.png')}
							className="w-24 h-24 rounded-lg"
						/>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<View className="flex-1 bg-white">
			{/* Top Image */}
			// Replace your top ImageBackground with this
<View className="flex-[6]">
  {place?.images && place.images.length > 0 ? (
    <FlatList
      data={place.images}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <ImageBackground
          source={{ uri: item }}
          className="w-screen h-full"
          resizeMode="cover"
        >
          <View
            className="flex-row justify-between items-center px-5 pt-5"
            style={{ paddingTop: 40 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="bg-white/50 p-2 rounded-full"
            >
              <Ionicons name="chevron-back" size={24} color={'#105679'} />
            </Pressable>
            <View className="bg-white/50 p-2 rounded-full">
              <Ionicons name="heart-outline" size={24} color={'#105679'} />
            </View>
          </View>
        </ImageBackground>
      )}
    />
  ) : (
    <ImageBackground
      source={require("../../../assets/images/splash/page1.png")}
      className="w-full h-full"
      resizeMode="cover"
    >
      <View
        className="flex-row justify-between items-center px-5 pt-5"
        style={{ paddingTop: 40 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="bg-white/50 p-2 rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color={'#105679'} />
        </Pressable>
        <View className="bg-white/50 p-2 rounded-full">
          <Ionicons name="heart-outline" size={24} color={'#105679'} />
        </View>
      </View>
    </ImageBackground>
  )}
</View>


			{/* Bottom Sheet Simulation */}
			<View className="flex-[4] bg-sec px-5 py-3 rounded-t-3xl -mt-10 pb-10">
				<View className="bg-grey w-20 mx-auto h-1.5 rounded-full mb-3" />

				{/* Place Info */}
				<View className="flex-col justify-between mb-1">
					<Text className="text-3xl font-medium text-pry">{place?.name}</Text>
					<Text className="text-2xl font-semibold text-grey line-clamp-1" >{place?.entryFee}</Text>
				</View>

				<View className="flex-row items-center gap-1 mb-2">
					<Ionicons name="location-sharp" size={20} color="#245678" />
					<Text className="text-base text-grey">{place?.address}</Text>
				</View>

				{/* Review Row */}
				<View className="flex-row items-center justify-between mb-3">
					<View className="flex-row items-center gap-2">
						<View className="flex-row">
							{[1,2,3,4,5,6].map((_, i) => (
								<Image
									key={i}
									source={require('../../../assets/images/splash/page1.png')}
									className="w-10 h-10 rounded-full mr-[-10px]"
								/>
							))}
						</View>
						<Text className="text-base text-grey ml-5">People Reviewed</Text>
					</View>
					<Text className="text-yellow-500 font-semibold">⭐ 4.5</Text>
				</View>

				{/* Tabs */}
				<View className="flex-row items-center gap-4 mb-2">
					{tabs.map((tab) => (
						<TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
							<Text
								className={`text-xl font-medium ${
									activeTab === tab ? 'text-pry ' : 'text-grey'
								}`}
							>
								{tab}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<ScrollView className="h-32">{renderTabContent()}</ScrollView>

				{/* Add to Trip Button */}
				<TouchableOpacity className="bg-pry btn">
					<Text className="text-white text-center text-lg font-medium">
						Add to Trip
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default PlaceDetailsScreen;
