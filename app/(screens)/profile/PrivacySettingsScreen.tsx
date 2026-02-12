import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import ProfileSection from '@/components/profile/ProfileSection';

const PrivacySettingsScreen: React.FC = () => {
    const [privateProfileEnabled, setPrivateProfileEnabled] = useState(false);
    const [visibleToFriendsEnabled, setVisibleToFriendsEnabled] = useState(true);
    const [visibleToEveryoneEnabled, setVisibleToEveryoneEnabled] = useState(false);

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen
                options={{
                    headerTitle: 'Privacy Settings',
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

                <ProfileSection title="Privacy Options">
                     <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="eye-off-outline" size={20} color="#333" />}
                        title="Private Profile"
                        subtitle='Only you can see your profile'
                        rightComponent={
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={privateProfileEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setPrivateProfileEnabled}
                                value={privateProfileEnabled}
                            />
                        }
                    />  </View>
                         <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>

                    <ProfileMenuItem
                        icon={<Ionicons name="people-outline" size={20} color="#333" />}
                        title="Visible to Friends"
                        subtitle='Your friends can see your profile'
                        rightComponent={
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={visibleToFriendsEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setVisibleToFriendsEnabled}
                                value={visibleToFriendsEnabled}
                            />
                        }
                    />  </View>
                     <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="earth-outline" size={20} color="#333" />}
                        title="Visible to Everyone"
                        subtitle='Everyone can see your profile'
                        rightComponent={
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={visibleToEveryoneEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setVisibleToEveryoneEnabled}
                                value={visibleToEveryoneEnabled}
                            />
                        }
                        isLast
                    />  </View>
                  
                </ProfileSection>

                <ProfileSection title="Data Sharing">
                     <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="share-social-outline" size={20} color="#333" />}
                        title="Share My Data"
                        subtitle=''
                    />  </View>
                     <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="document-text-outline" size={20} color="#333" />}
                        title="Data Usage Policy"
                        isLast
                        subtitle=''
                    />  </View>
                </ProfileSection>
            </ScrollView>
        </View>
    );
};

export default PrivacySettingsScreen;

