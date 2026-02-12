import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileMenuItem from "@/components/profile/ProfileMenuItem";
import ProfileSection from "@/components/profile/ProfileSection";

const HelpAndSupportScreen: React.FC = () => {
  const handleCall = () => {
    Linking.openURL("tel:+2348012345678");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@setincee.com");
  };

  const handleChat = () => {
    console.log("Open chat support");
  };

  const handleReportBug = () => {
    console.log("Report a bug");
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Help & Support",
          headerShadowVisible: false,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="border-b border-gray-300 mt-5" />
      <ScrollView contentContainerStyle={{ padding: 5 }}>
        <ProfileSection title="Quick Actions">
          <View className="flex-row flex-wrap justify-between py-2">
            <TouchableOpacity
              onPress={handleChat}
              className="items-center m-2 p-3 bg-blue-50 rounded-lg w-[45%]"
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={30}
                color="#3b82f6"
              />
              <Text className="text-blue-600 mt-2 text-center">
                Chat with Us
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEmail}
              className="items-center m-2 p-3 bg-green-50 rounded-lg w-[45%]"
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={30}
                color="#22c55e"
              />
              <Text className="text-green-600 mt-2 text-center">
                Email Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCall}
              className="items-center m-2 p-3 bg-orange-50 rounded-lg w-[45%]"
            >
              <Ionicons name="call-outline" size={30} color="#f97316" />
              <Text className="text-orange-600 mt-2 text-center">Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReportBug}
              className="items-center m-2 p-3 bg-red-50 rounded-lg w-[45%]"
            >
              <Ionicons name="bug-outline" size={30} color="#ef4444" />
              <Text className="text-red-600 mt-2 text-center">Report Bug</Text>
            </TouchableOpacity>
          </View>
        </ProfileSection>

        <ProfileSection title="Help Topics">
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={<Ionicons name="book-outline" size={20} color="#333" />}
              title="Getting Started"
              subtitle="Learn the basics"
              onPress={() => console.log("Navigate to Getting Started details")}
            />
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={<Ionicons name="airplane-outline" size={20} color="#333" />}
              title="Planning Trips"
              subtitle="Create and manage trips"
              onPress={() => console.log("Navigate to Planning Trips details")}
            />
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={<Ionicons name="bookmark-outline" size={20} color="#333" />}
              title="Saving Places"
              subtitle="Organize your favorites"
              onPress={() => console.log("Navigate to Saving Places details")}
            />
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={<Ionicons name="star-outline" size={20} color="#333" />}
              title="Reviews & Ratings"
              subtitle="Share your experiences"
              onPress={() =>
                console.log("Navigate to Reviews & Ratings details")
              }
            />
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={<Ionicons name="hammer-outline" size={20} color="#333" />}
              title="Troubleshooting"
              subtitle="Fix common issues"
              onPress={() => console.log("Navigate to Troubleshooting details")}
              isLast
            />
          </View>
        </ProfileSection>

        <ProfileSection title="Popular FAQs">
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <Text className="text-gray-800 font-semibold mb-2">
              How do I create a trip?
            </Text>
            <Text className="text-gray-600 mb-4">
              Tap the + button on the Trips page to start planning your
              adventure.
            </Text>
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <Text className="text-gray-800 font-semibold mb-2">
              Can I share trips with friends?
            </Text>
            <Text className="text-gray-600 mb-4">
              Yes! Use the group trips feature to plan together with friends.
            </Text>
          </View>
          <View className="bg-[#f8fafc] p-2 rounded-lg mt-2">
            <Text className="text-gray-800 font-semibold mb-2">
              How do I save places offline?
            </Text>
            <Text className="text-gray-600 mb-4">
              Saved places are automatically available offline for your
              convenience.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => console.log("View All FAQs")}
            className="mt-3"
          >
            <Text className="text-blue-600 font-semibold text-center">
              View All FAQs →
            </Text>
          </TouchableOpacity>
        </ProfileSection>

        <ProfileSection title="Contact Information">
          <View className="bg-[#f0f6ff] p-2 rounded-lg mt-2">
            <ProfileMenuItem
              icon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#155dfc"
                />
              }
              title="Email"
              subtitle="support@setincee.com"
              onPress={handleEmail}
            />
            <ProfileMenuItem
              icon={<Ionicons name="call-outline" size={20} color="#155dfc" />}
              title="Phone"
              subtitle="+234 808 987654"
              onPress={handleCall}
            />
            <ProfileMenuItem
              icon={
                <MaterialCommunityIcons name="web" size={20} color="#155dfc" />
              }
              title="Website"
              subtitle="www.setincee.com"
              onPress={() => Linking.openURL("https://www.setincee.com")}
              isLast
            />
          </View>
        </ProfileSection>

        <View className="my-4 p-2">
          <Text className="text-lg pb-3 font-bold">Send Us Feedback</Text>
          <TextInput
            className="bg-[#f8fafc] h-48 w-full rounded-lg p-4 text-base text-gray-800"
            placeholder="Tell us what you think"
            placeholderTextColor="#9ca3af"
            multiline={true}
            textAlignVertical="top"
            numberOfLines={6}
          />
        </View>
      <TouchableOpacity className="bg-blue-600 rounded-md mb-20 p-4 m-2 flex-row items-center justify-center gap-2">
    <Ionicons name="send" size={20} color="#fff"/>
    <Text className="text-white text-center text-xl">Send Feedback</Text>
</TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HelpAndSupportScreen;
