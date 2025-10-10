import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
	value: string;
	onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
	return (
		<View className="bg-white px-3 py-2 rounded-full flex-row items-center">
			<Ionicons name="search" size={25} color="gray" />
			<TextInput
				placeholder="Search"
				placeholderTextColor="gray"
				className="h-full flex-1 text-base"
				value={value}
				onChangeText={onChange}
			/>
		</View>
	);
};

export default SearchBar;
