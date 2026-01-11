import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
	value: string;
	onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
	return (
		<View className="flex-row items-center justify-between">
			<View className='w-[75%]'>
				<Text className=' text-3xl text-pry text-bold '>Explore a City Like You’ve Been There Before</Text>
			</View>
			<View className='bg-pry w-16 h-16 rounded-full flex items-center justify-center'>
					<Ionicons name="search" size={25} color="white" />
			</View>
			{/* <TextInput
				placeholder="Search"
				placeholderTextColor="gray"
				className="h-full flex-1 text-base"
				value={value}
				onChangeText={onChange}
			/> */}
		</View>
	);
};

export default SearchBar;
