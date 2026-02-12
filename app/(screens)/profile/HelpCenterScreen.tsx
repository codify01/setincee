import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import ProfileSection from '@/components/profile/ProfileSection';

const HelpCenterScreen: React.FC = () => {
    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: 'Help center',
                    headerShadowVisible: false,
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View className='border-b border-gray-300 mt-5'/>
            <ScrollView contentContainerStyle={{ padding: 5 }}>
                <ProfileSection title="Help Topics">
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>

                    <ProfileMenuItem
                        icon={<Ionicons name="book-outline" size={20} color="#333" />}
                        title="Getting Started"
                        onPress={() => router.push('/(screens)/profile/HelpAndSupportScreen')}
                        subtitle="Learn how to use our app"
                    />
                     
                    </View>
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="hammer-outline" size={20} color="#333" />}
                        title="Troubleshooting"
                        subtitle="Fix common issues"
                        onPress={() => router.push('/(screens)/profile/HelpAndSupportScreen')}
                    /> </View>
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="chatbox-outline" size={20} color="#333" />}
                        title="FAQs"
                        onPress={() => router.push('/(screens)/profile/HelpAndSupportScreen')}
                        isLast
                        subtitle="Frequently asked questions"
                    /> </View>
                </ProfileSection>
            </ScrollView>
        </View>
    );
};

export default HelpCenterScreen;

