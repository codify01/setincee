import { View, Text, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
	firstName: string;
}

const Header: React.FC<HeaderProps> = ({ firstName }) => {
	return (
		<View className="flex-row items-start justify-between">
			<View className="flex-row gap-3">
				<Image
					source={{
						uri: 'https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/ecommerce/car-interior-design.jpg',
					}}
					className="w-14 h-14 rounded-full"
				/>
				<View>
					<View className="flex-row">
						<Text className="text-xl text-grey">Welcome Back, </Text>
						<Text className="text-xl text-pry">{firstName}</Text>
					</View>
					<View className="flex-row gap-1">
						<Ionicons name="location" size={20} color={'#155dfc'}/>
						<Text className="text-xl font-medium text-pry">
							Ogbomosho, Oyo State
						</Text>
					</View>
				</View>
				
			</View>
			{/* <View className="bg-sec w-16 h-16 rounded-full flex justify-center items-center">
					<Ionicons name="notifications-outline" size={28} color={'white'} />
				</View> */}
		</View>
	);
};

export default Header;
