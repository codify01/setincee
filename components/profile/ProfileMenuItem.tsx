import { View, Text, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ProfileMenuItemProps {
    icon: ReactNode; 
    title: string;
    subtitle?: string; 
    onPress?: () => void;
    rightComponent?: ReactNode; 
    isLast?: boolean; 
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    subtitle,
    title,
    onPress,
    rightComponent,
    isLast
}) => {
    return (
        <TouchableOpacity
            className={`flex-row items-center justify-between py-3 ${!isLast ? '' : ''}`}
            onPress={onPress}
            disabled={!onPress}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-8 items-center">
                    {icon}
                </View>
                <View className={subtitle ? '' : 'justify-center'}>
                    <Text className="text-base text-gray-800">{title}</Text>
                    {subtitle && (
                        <Text className="text-sm text-gray-400 mt-0.5">{subtitle}</Text>
                    )}
                </View>
            </View>
            <View>
                {rightComponent || <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />}
            </View>
        </TouchableOpacity>
    );
};

export default ProfileMenuItem;