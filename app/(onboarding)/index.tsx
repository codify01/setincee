import {
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	Platform,
	Pressable,
	ImageSourcePropType,
	ImageBackground,
	Image,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
	const [page, setPage] = React.useState(1);
	const totalPages = 3;
	const progressPercent = (page / totalPages) * 100;
	const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

	type OnboardingPage = {
		id: number;
		title: string;
		description: string;
		image: ImageSourcePropType;
	};

	const pages: OnboardingPage[] = [
		{
			id: 1,
			title: 'Your Journey Starts Here',
			description:
				'Discover hidden gems, local secrets, and unforgettable experiences—right at your fingertips.',
			image: {
				uri: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135853/cld-sample-2.jpg',
			},
		},
		{
			id: 2,
			title: 'Plan Less. Explore More.',
			description:
				'Skip the stress. Get smart suggestions, real-time guides, and travel tips tailored just for you.',
			image: {
				uri: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1757601713/iyake-lake3_jmserx.webp',
			},
		},
		{
			id: 3,
			title: 'Go Beyond the Guidebook',
			description:
				'Whether it’s food, culture, or adventure—find it all in one app. Travel like a local, not a tourist.',
			image: require('../../assets/images/splash/page1.png'),
		},
	];

	const moveToNextPage = async () => {
		if (page < totalPages) {
			setPage(page + 1);
		} else {
			try {
				await AsyncStorage.setItem('hasSeenOnboarding', 'true');
			} catch (storageError) {
				console.log('Unable to persist onboarding status', storageError);
			}
			router.replace('/(auth)');
		}
	};

	const moveToPreviousPage = () => {
		if (page > 1) {
			setPage(page - 1);
		} else {
			console.log('You are at the first page');
		}
	};

	const currentPage = pages[page - 1];

	return (
		<SafeAreaView
			className="flex-1 bg-white"
			style={{ paddingTop: topPadding }}
		>
			<StatusBar />

			<View className="flex-1 justify-between">
				<View className="flex-row items-center justify-between px-4 py-2">
				 	<TouchableOpacity onPress={moveToPreviousPage}>
						<Ionicons
							name="chevron-back"
							size={24}
							color="black"
						/>
					</TouchableOpacity>
					
					<Pressable onPress={moveToNextPage}>
						<Text className="text-pry text-base font-medium">
							Skip
						</Text>
					</Pressable>
				</View>

				<View className="flex-2 ">
					<Image
						source={currentPage.image}
						className="w-full h-96 object-cover"
					/>
					<View>
						<Text className="text-3xl text-center font-semibold text-pry">
							{currentPage.title}
						</Text>
						<Text className="text-grey text-center text-base">
							{currentPage.description}
						</Text>
						<View className='flex flex-row justify-center gap-1'>
							<View className='h-3 w-3 bg-neutral-500 rounded-full'></View>
							<View className='h-3 w-8 bg-neutral-500 rounded-full'></View>
							<View className='h-3 w-3 bg-neutral-500 rounded-full'></View>
							<View className='h-3 w-3 bg-neutral-500 rounded-full'></View>
						</View>
						<TouchableOpacity
							className="btn bg-pry p-3 rounded-lg flex-row justify-center items-center mt-6 mx-4 gap-3"
							onPress={moveToNextPage}
						>
							<Text className="text-white text-center text-lg">
								{page < totalPages ? 'Continue' : 'Get Started'}
							</Text>
							{page < totalPages && (
								<Ionicons
									name="arrow-forward"
									size={20}
									color="white"
								/>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Index;
