import { View, Text } from 'react-native';
import React, { ReactNode } from 'react';

interface ProfileSectionProps {
    title?: string; 
    children: ReactNode; 
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    title,
    children
}) => {
    return (
        <View className="mb-4 px-4 py-2 ">
            {title && (
                <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
            )}
            {children}
        </View>
    );
};

export default ProfileSection;

