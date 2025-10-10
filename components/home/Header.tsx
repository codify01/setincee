import { View, Text, Image } from 'react-native';
import React from 'react';

interface HeaderProps {
	firstName: string;
}

const Header: React.FC<HeaderProps> = ({ firstName }) => {
	return (
		<View className="flex-row items-start justify-between">
			<View>
				<Text className="text-md text-grey">Hi {firstName}</Text>
				<Text className="text-3xl font-semibold text-pry">Travelling Today?</Text>
			</View>
			<Image source={{uri:"https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/ecommerce/car-interior-design.jpg"}} className="w-14 h-14 rounded-full" />
		</View>
	);
};

export default Header;
