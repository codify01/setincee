// app/(onboarding)/index.tsx

import {
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	Platform,
	Pressable,
	ImageSourcePropType,
	StyleSheet,
	Image,
	Animated,
	Easing,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

type OnboardingPage = {
	id: number;
	title: string;
	description: string;
	image: ImageSourcePropType;
	gradient: string[];
};

const pages: OnboardingPage[] = [
	{
		id: 1,
		title: 'Discover Amazing Places',
		description:
			'Explore hidden gems, trending spots, and personalized recommendations tailored just for you',
		image: require('../../assets/images/onboarding/1.png'),
		gradient: ['#2B7FFF', '#00D3F2'],
	},
	{
		id: 2,
		title: 'Plan Perfect Trips',
		description:
			'Create detailed itineraries with day-by-day planning, manage places, and track your adventures',
		image: require('../../assets/images/onboarding/2.png'),
		gradient: ['#AD46FF', '#FB64B6'],
	},
	{
		id: 3,
		title: 'AI-Powered Itineraries',
		description:
			'Just tell us your travel idea and let AI craft the perfect personalized itinerary in seconds',
		image: require('../../assets/images/onboarding/3.png'),
		gradient: ['#8E51FF', '#8E51FF'],
	},
	{
		id: 4,
		title: 'Save Your Favorites',
		description:
			'Bookmark places you love, create collections, and never lose track of must-visit destinations',
		image: require('../../assets/images/onboarding/4.png'),
		gradient: ['#F6339A', '#FF637E'],
	},
	{
		id: 5,
		title: 'Navigate with Ease',
		description:
			'Interactive maps with category pins, directions, and real-time location tracking',
		image: require('../../assets/images/onboarding/5.png'),
		gradient: ['#00BC7D', '#00D5BE'],
	},
];

const Index = () => {
	const [page, setPage] = React.useState(1);
	const [direction, setDirection] = React.useState<1 | -1>(1);
	const totalPages = pages.length;
	const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

	const currentPage = pages[page - 1];
	const slideAnim = React.useRef(new Animated.Value(0)).current;
	const fadeAnim = React.useRef(new Animated.Value(1)).current;

	React.useEffect(() => {
		// Slide new content in from the tap direction while fading it up
		slideAnim.setValue(direction * 50);
		fadeAnim.setValue(0.65);

		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 320,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 320,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
		]).start();
	}, [page, direction]);

	const moveToNextPage = async () => {
		if (page < totalPages) {
			setDirection(1);
			setPage((p) => p + 1);
			return;
		}

		try {
			await AsyncStorage.setItem('hasSeenOnboarding', 'true');
		} catch (e) {
			console.log('Unable to persist onboarding status', e);
		}

		router.replace('/(auth)');
	};

	const moveToPreviousPage = () => {
		if (page > 1) {
			setDirection(-1);
			setPage((p) => p - 1);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white" >
			<StatusBar barStyle="dark-content" />

			{/* Header */}
			<View className="flex-row items-center justify-between px-4 py-2">
				<TouchableOpacity
					onPress={moveToPreviousPage}
					disabled={page === 1}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color={page === 1 ? '#ccc' : 'black'}
					/>
				</TouchableOpacity>

				<Pressable onPress={moveToNextPage}>
					<Text className="text-pry text-base font-medium">Skip</Text>
				</Pressable>
			</View>

			{/* Content */}
			<View className="flex-1 px-4">
				<Animated.View
					style={{
						flex: 1,
						transform: [{ translateX: slideAnim }],
						opacity: fadeAnim,
					}}
					>
					{/* Image */}
					<View style={{ flex: 3 }} className="justify-center items-center">
						<Image
							source={currentPage.image}
							style={{ width: '100%', height: '100%' }}
							resizeMode="contain"
						/>
					</View>

					{/* Text */}
					<View style={{ flex: 2 }} className="gap-5 justify-center items-center px-4">
						<Text className="text-3xl text-center font-medium">
							{currentPage.title}
						</Text>

						<Text className="text-grey text-center text-base">
							{currentPage.description}
						</Text>

						{/* Pagination */}
						<View className="flex-row justify-center gap-2">
							{pages.map(({ gradient }, index) => {
								const isActive = index + 1 === page;

								return (
									<View
										key={index}
										className={`h-3 rounded-full ${
											isActive ? 'w-8' : 'w-3 bg-neutral-300'
										}`}
										style={
											isActive
												? { backgroundColor: gradient[0] }
												: undefined
										}
									/>
								);
							})}
						</View>
					</View>
				</Animated.View>

				{/* CTA */}
				<TouchableOpacity
					activeOpacity={0.9}
					className="mb-4"
					onPress={moveToNextPage}
				>
					<LinearGradient
						colors={currentPage.gradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.gradientButton}
					>
						<Text className="text-white text-lg font-medium">
							{page < totalPages ? 'Next' : 'Get Started'}
						</Text>

						{page < totalPages && (
							<Ionicons name="chevron-forward" size={16} color="white" />
						)}
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
		gap: 8,
		paddingVertical: 18,
		borderRadius: 14,
	},
});

export default Index;
