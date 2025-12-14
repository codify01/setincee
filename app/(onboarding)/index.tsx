import {
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	Platform,
	Pressable,
	ImageSourcePropType,
    ImageBackground,
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
			image: { uri: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135853/cld-sample-2.jpg' },
		},
		{
			id: 2,
			title: 'Plan Less. Explore More.',
			description: 'Skip the stress. Get smart suggestions, real-time guides, and travel tips tailored just for you.',
			image: { uri: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1757601713/iyake-lake3_jmserx.webp' },
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
            router.replace('/(auth)')
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
		<SafeAreaView className="flex-1 bg-white" style={{ paddingTop: topPadding }}>
			<StatusBar />

			<View className="flex-[7]">
				<View className="flex-row items-center justify-between px-4 py-2">
					{/* <Pressable onPress={moveToPreviousPage}>
						<Ionicons name="chevron-back" size={24} color="black" />
					</Pressable>
					<View className="bg-sec w-72 h-1.5 rounded-full mb-2 overflow-hidden">
						<View
							className={'bg-pry h-full rounded-full'}
							style={{ width: `${progressPercent}%` }}
						></View>
					</View>
					<Text>
						{page}/{totalPages}
					</Text> */}
					<Text className="text-grey text-sm flex-1 text-right">
						Skip
					</Text>
				</View>

				<View className="">
					<ImageBackground
						source={currentPage.image}
						className="w-full h-full"
					/>
				</View>
			</View>

			<View className="flex-[3] justify-center gap-7 border-x border-t border-pry p-4 rounded-t-3xl bg-white">
				<View className="bg-neutral-500 w-20 mx-auto h-1.5 rounded-full" />
				<Text className="text-3xl text-center font-semibold text-pry">
					{currentPage.title}
				</Text>
				<Text className="text-grey text-center text-base">
					{currentPage.description}
				</Text>
				<TouchableOpacity
					className="btn bg-pry p-3 rounded-lg"
					onPress={moveToNextPage}
				>
					<Text className="text-white text-center font-medium">
						{page < totalPages ? 'Continue' : 'Get Started'}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default Index;
