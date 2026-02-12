import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }
        // Logic to change password
        console.log('Changing password...', { currentPassword, newPassword });
        Alert.alert('Success', 'Password changed successfully!');
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: 'Change Password',
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
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="mb-5">
                    <Text className="text-gray-700 text-base font-semibold mb-2">Current Password</Text>
                    <TextInput
                        className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                    />
                </View>

                <View className="mb-5">
                    <Text className="text-gray-700 text-base font-semibold mb-2">New Password</Text>
                    <TextInput
                        className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        
                    />
                </View>

                <View className="mb-5">
                    <Text className="text-gray-700 text-base font-semibold mb-2">Confirm New Password</Text>
                    <TextInput
                        className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 rounded-lg py-4 items-center mt-6"
                    onPress={handleChangePassword}
                >
                    <Text className="text-white text-lg font-semibold">Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ChangePasswordScreen;

