import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const ProfileTab = () => {
	const { user, logout } = useAuth();

	const handleLogOut = async () => {
		try {
			await logout();
			router.push('/(auth)/login');
		} catch (error) {
			console.error('Logout failed:', error);
			Alert.alert('Error', 'Failed to log out. Please try again.');
		}
	}

	return (
		<ScrollView className="flex-1 bg-sec px-5 pt-6">
			{/* Header */}
			<View className="items-center mb-6">
				<Image
					source={{uri:"https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/ecommerce/car-interior-design.jpg"}}
					className="w-24 h-24 rounded-full mb-3"
				/>
				<Text className="text-2xl font-semibold text-pry">{user?.lastName + ' ' + user?.firstName}</Text>
				<Text className="text-gray-500 text-sm">{user?.username}</Text>
			</View>

			{/* Profile Actions */}
			<View className="bg-white rounded-2xl p-5 border border-neutral-200 mb-6">
				<TouchableOpacity className="flex-row items-center justify-between mb-5" onPress={()=>router.push(`/(screens)/userDetails/${user?._id}`)}>
					<View className="flex-row items-center gap-3">
						<Ionicons name="person-outline" size={20} color="#333" />
						<Text className="text-base text-gray-700">Edit Profile</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color="#aaa" />
				</TouchableOpacity>

				<TouchableOpacity className="flex-row items-center justify-between mb-5">
					<View className="flex-row items-center gap-3">
						<Feather name="settings" size={20} color="#333" />
						<Text className="text-base text-gray-700">Account Settings</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color="#aaa" />
				</TouchableOpacity>

				<TouchableOpacity className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-3">
						<MaterialCommunityIcons name="lock-outline" size={20} color="#333" />
						<Text className="text-base text-gray-700">Privacy</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color="#aaa" />
				</TouchableOpacity>
			</View>

			{/* My Activity */}
			<View className="bg-white rounded-2xl p-5 border border-neutral-200 mb-6">
				<Text className="text-pry font-semibold text-lg mb-4">My Activity</Text>
				<View className="flex-row justify-between mb-3">
					<Text className="text-gray-600">Trips Created</Text>
					<Text className="font-semibold text-pry">12</Text>
				</View>
				<View className="flex-row justify-between mb-3">
					<Text className="text-gray-600">Places Visited</Text>
					<Text className="font-semibold text-pry">28</Text>
				</View>
				<View className="flex-row justify-between">
					<Text className="text-gray-600">Favorites</Text>
					<Text className="font-semibold text-pry">7</Text>
				</View>
			</View>

			{/* Preferences / Extras */}
			<View className="bg-white rounded-2xl p-5 border border-neutral-200 mb-6">
				<Text className="text-pry font-semibold text-lg mb-4">Preferences</Text>

				<TouchableOpacity className="flex-row items-center justify-between mb-4">
					<Text className="text-gray-700">Notifications</Text>
					<Ionicons name="chevron-forward" size={20} color="#aaa" />
				</TouchableOpacity>

				<TouchableOpacity className="flex-row items-center justify-between">
					<Text className="text-gray-700">Language & Region</Text>
					<Ionicons name="chevron-forward" size={20} color="#aaa" />
				</TouchableOpacity>
			</View>

			{/* Logout */}
			<TouchableOpacity className="items-center py-4" onPress={handleLogOut}>
				<Text className="text-red-500 font-semibold">Log Out</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default ProfileTab;
