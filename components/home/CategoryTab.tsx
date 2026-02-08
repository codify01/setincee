import { TouchableOpacity, Text, View, Image } from 'react-native';
import React from 'react';

const CategoryTab = ({ 
  title, 
  isActive, 
  onPress,
  imageSource,
  showImage = true,
  activeColor = '#3B82F6',
  inactiveColor = '#6B7280',
  activeBackgroundColor = '#3B82F6',
  inactiveBackgroundColor = '#f7f7f7',
  imageSize = 24,
  style
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        px-5 py-4 gap-4 rounded-full my-4 flex-row items-center justify-center mr-3
      `}
      style={[
        {
          backgroundColor: isActive ? activeBackgroundColor : inactiveBackgroundColor,
        },
        style
      ]}
    >
      {showImage && imageSource && (
        <Image
          source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
          style={{ 
            width: imageSize, 
            height: imageSize,
            marginRight: 4,
            borderRadius: 12,
          }}
          resizeMode="contain"
        />
      )}
      <Text
        className={`font-semibold text-base ${
          isActive ? 'text-white' : 'text-gray-600'
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryTab;
