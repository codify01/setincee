import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useProfileTabData } from "@/hooks/useProfileTabData";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import ProfileSection from "@/components/profile/ProfileSection";

const ProfileTab = () => {
  const { user, logout } = useAuth();
  const { data: profileData, loading, error } = useProfileTabData();

  // Console.log the profile data
  console.log('Profile Data:', profileData);
  console.log('Auth User:', user);

  const handleLogOut = async () => {
    try {
      await logout();
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Use profile data from API or fallback to dummy data
  const profileInfo = profileData || {
    user: {
      _id: "1",
      firstName: "Alex",
      lastName: "Johnson",
      username: "@alexjohnson"
    },
    activity: {
      tripsCreated: 8,
      placesVisited: 42,
      favorites: 23,
      reviews: 15
    }
  };

  const displayName = profileInfo.user ? `${profileInfo.user.firstName} ${profileInfo.user.lastName}` : "Alex Johnson";
  const username = profileInfo.user?.username || "@alexjohnson";
  const profileImage = user?.profilePicture || "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/ecommerce/car-interior-design.jpg";
  const placesCount = profileInfo.activity?.placesVisited || 0;
  const tripsCount = profileInfo.activity?.tripsCreated || 0;
  const savedCount = profileInfo.activity?.favorites || 0;
  const reviewsCount = profileInfo.activity?.reviews || 0;
  
  // Format member since date from user creation date
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "January 2024";

  // Default interests and reviews (these could come from API later)
  const interests = ["Food", "Nature", "Culture", "Adventure", "Photography"];
  const recentReviews = [
    {
      id: "r1",
      placeName: "Joliol Junction",
      reviewDate: "2024-03-10",
      reviewText: "Amazing authentic Nigerian cuisine! The jollof rice was perfectly spiced.",
      image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
    },
    {
      id: "r2",
      placeName: "Nike Art Gallery",
      reviewDate: "2024-03-05",
      reviewText: "Incredible collection of African art. A must-visit for culture lovers!",
      image: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-blue-600 h-72 absolute top-0 left-0 right-0" />
      <View className="px-5 pt-12 pb-4">
  {/* Profile Card */}
  <View className="bg-white rounded-3xl shadow-md p-5 items-center mx-2 mt-20">
    {/* Profile Section */}
    <View className="flex-row items-start w-full mb-4">
      {/* Profile Image */}
      <View className="mr-4">
        <Image
          source={{ uri: profileImage }}
          className="w-28 h-28 rounded-full border-2 border-white"
        />
      </View>
      
      {/* User Info */}
      <View className="flex-1 pt-5">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {displayName}
        </Text>
        
        <View className="flex-row items-center mb-1">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-gray-600 text-sm ml-1">
            {username}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text className="text-gray-600 text-sm ml-1">
            Member since {memberSince}
          </Text>
        </View>
      </View>
    </View>

    {/* Bio */}
    <Text className="text-gray-700 text-start text-md w-full mb-5 ml-4">
      Travel enthusiast exploring hidden gems around the world 🌍
    </Text>

    {/* Stats */}
    <View className="flex-row justify-around w-full mb-6">
      <View className="items-center">
        <Text className="text-2xl font-bold text-blue-600">
          {placesCount}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">Places</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-purple-600">
          {tripsCount}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">Trips</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-orange-600">
          {reviewsCount}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">Reviews</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-pink-600">
          {savedCount}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">Saved</Text>
      </View>
    </View>

    {/* Action Buttons */}
    <View className="flex-row gap-3 w-full">
      <TouchableOpacity
        className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
        onPress={() =>
          router.push("/(screens)/profile/EditProfileScreen")
        }
      >
        <Text className="text-white text-base font-semibold">
          Edit Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-1 bg-gray-100 rounded-lg py-3 items-center">
        <Text className="text-gray-700 text-base font-semibold">
          Share Profile
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

      <View className="mt-4">
        {/* Interests Section */}
		<View className="border-b-2 border-gray-300">
			<View className="px-4">

        <ProfileSection title="Interests">
          <View className="flex-row flex-wrap gap-2 ">
            {interests.map((interest: string, index: number) => (
              <View key={index} className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-600 text-sm">{interest}</Text>
              </View>
            ))}
            <TouchableOpacity className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="add" size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm">Add Interest</Text>
            </TouchableOpacity>
          </View>
        </ProfileSection>
			</View>
		</View>

        {/* Achievements Section */}
		<View className="border-b-2 border-gray-300">
			<View className="px-4">

        <ProfileSection title="Achievements">
          <View className="flex-row justify-between py-2">
            <View className="items-center  flex-row gap-1 border border-[#d08700] rounded-xl bg-[#fefaea] py-3 px-6">
              <MaterialCommunityIcons
                name="medal-outline"
                size={30}
                color="#f97316"
              />
              <Text className="text-sm font-semibold text-gray-800 mt-1">
                Early Adaptor
              </Text>
            </View>
            <View className="items-center flex-row gap-1 border border-[#d08700] rounded-xl bg-[#fefaea] py-3 px-6">
              <MaterialCommunityIcons
                name="medal-outline"
                size={30}
                color="#f97316"
              />
              <Text className="text-sm font-semibold text-gray-800 mt-1">
                Local Explorer
              </Text>
            </View>
          </View>
        </ProfileSection>
			</View>

		</View>

        {/* Recent Reviews */}
		<View className="border-b-2 border-gray-300">
			<View className="flex-row justify-between  px-4 py-4">
<Text>Recent Reviews</Text>
			   <TouchableOpacity
            onPress={() => router.push("/(screens)/profile/ReviewsScreen")}
            className=" items-end"
          >
            <Text className="text-blue-600 font-semibold">See all</Text>
          </TouchableOpacity>
			</View>
        <ProfileSection title="">
			
          {recentReviews.map((review: any, index: number) => (
            <View key={review.id} className="flex-row bg-[#eaedef] p-4 rounded-lg  items-center mb-4">
              <Image
                source={{ uri: review.image }}
                className="w-16 h-16 rounded-md mr-3"
              />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {review.placeName}
                </Text>
                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                  {review.reviewText}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {review.reviewDate}
                </Text>
              </View>
            </View>
          ))}
       
        </ProfileSection>
		</View>

        {/* General Settings */}
        <ProfileSection>
			<View className="bg-[#eaedef] my-2 p-3 rounded-lg">

          <ProfileMenuItem
          subtitle=""
            icon={<Feather name="settings" size={20} color="#333" />}
            title="Settings"
            onPress={() => router.push("/(screens)/profile/SettingsScreen")}
          />
			</View>
			<View className="bg-[#eaedef] my-2 p-3 rounded-lg">
          <ProfileMenuItem
          subtitle=""
            icon={
              <Ionicons name="help-circle-outline" size={20} color="#333" />
            }
            title="Help & Support"
            onPress={() =>
              router.push("/(screens)/profile/HelpAndSupportScreen")
            }
            isLast
          />
			</View>

        </ProfileSection>

        {/* Logout */}
        <TouchableOpacity
          className="bg-[#fef2f2] mb-10 mx-5 p-4 rounded-lg border border-gray-100 items-center"
          onPress={handleLogOut}
        >
          <Text className="text-red-500 text-base font-semibold">Log Out</Text>
        </TouchableOpacity>
		<Text className="text-sm text-gray-300 text-center py-6">Setince v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
