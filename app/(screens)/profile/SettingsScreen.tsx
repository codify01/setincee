import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import ProfileSection from '@/components/profile/ProfileSection';

const SettingsScreen: React.FC = () => {
    const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
    const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false);

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: 'Settings',
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
            <ScrollView contentContainerStyle={{ padding: 10 }}>
                <ProfileSection title="Notifications">
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        icon={<Ionicons name="notifications-outline" size={20} color="#333" />}
                        title="Push Notifications"
                        subtitle=""
                        rightComponent={
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={pushNotificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setPushNotificationsEnabled}
                                value={pushNotificationsEnabled}
                            />
                        }
                        isLast
                    />

                    </View>
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                           <ProfileMenuItem
                        icon={<MaterialCommunityIcons name="email-outline" size={20} color="#333" />}
                        title="Email Updates"
                        subtitle=""
                        rightComponent={
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={emailUpdatesEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setEmailUpdatesEnabled}
                                value={emailUpdatesEnabled}
                            />
                        }
                        isLast
                    />
                    </View>
                </ProfileSection>

                 

                <ProfileSection title="Privacy & Security">
                        <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                        subtitle=""
                        icon={<Ionicons name="lock-closed-outline" size={20} color="#333" />}
                        title="Change Password"
                        onPress={() => router.push('/(screens)/profile/ChangePasswordScreen')}
                    />
  </View>

  <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                    subtitle=""
                        icon={<Ionicons name="shield-checkmark-outline" size={20} color="#333" />}
                        title="Privacy Settings"
                        onPress={() => router.push('/(screens)/profile/PrivacySettingsScreen')}
                        isLast
                    />
                      </View>
                </ProfileSection>

                <ProfileSection title="Preferences">
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                    subtitle=""
                        icon={<Ionicons name="language-outline" size={20} color="#333" />}
                        title="Language"
                        rightComponent={<Text className="text-gray-500">English</Text>}
                    />  </View>
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                    subtitle=""
                        icon={<Feather name="compass" size={20} color="#333" />}
                        title="Interests"
                        isLast
                    />  </View>
                </ProfileSection>

                <ProfileSection title="Support">
                    <View className='bg-[#f8fafc] p-2 rounded-lg mt-2'>
                    <ProfileMenuItem
                    subtitle=""
                        icon={<Ionicons name="help-circle-outline" size={20} color="#333" />}
                        title="Help Center"
                        onPress={() => router.push('/(screens)/profile/HelpCenterScreen')}
                        isLast
                    />  </View>
                </ProfileSection>
            </ScrollView>
        </View>
    );
};

export default SettingsScreen;

