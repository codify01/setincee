import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  suggestions: string[];
  onSelect: (val: string) => void;
}

const SearchSuggestions: React.FC<Props> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <View className="bg-white rounded-lg mb-6 p-3 border border-gray-300">
      {suggestions.map((sug, i) => (
        <TouchableOpacity key={i} className="py-2" onPress={() => onSelect(sug)}>
          <Text className="text-gray-700">{sug}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SearchSuggestions;
