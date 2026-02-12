import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

const EditProfileScreen: React.FC = () => {
    const [fullName, setFullName] = useState('Alex Johnson');
    const [email, setEmail] = useState('alex.johnson@email.com');
    const [phone, setPhone] = useState('+234 801 234 5678');
    const [bio, setBio] = useState('Tell us about yourself...');
    const [profileImage, setProfileImage] = useState('https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135827/samples/ecommerce/car-interior-design.jpg');

    const handleSaveChanges = () => {
        console.log('Saving changes...', { fullName, email, phone, bio });
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: 'Edit Profile',
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
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView 
                    contentContainerStyle={{ padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center my-8">
                        <TouchableOpacity onPress={() => console.log('Change photo')}> 
                            <Image
                                source={{ uri: profileImage }}
                                className="w-32 h-32 rounded-full mb-3 border border-gray-200"
                            />
                            <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-200">
                                <Ionicons name="camera" size={20} color="#333" />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-blue-600 mt-2">Change profile photo</Text>
                    </View>

                    <View className="mb-5">
                        <Text className="text-gray-700 text-base font-semibold mb-2">Full Name</Text>
                        <TextInput
                            className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View className="mb-5">
                        <Text className="text-gray-700 text-base font-semibold mb-2">Email</Text>
                        <TextInput
                            className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="mb-5">
                        <Text className="text-gray-700 text-base font-semibold mb-2">Phone</Text>
                        <TextInput
                            className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View className="mb-5">
                        <Text className="text-gray-700 text-base font-semibold mb-2">Bio</Text>
                        <TextInput
                            className="bg-[#f8fafc] rounded-lg p-4 text-base text-gray-800 h-24"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 rounded-lg py-4 items-center mt-6"
                        onPress={handleSaveChanges}
                    >
                        <Text className="text-white text-lg font-semibold">Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditProfileScreen;