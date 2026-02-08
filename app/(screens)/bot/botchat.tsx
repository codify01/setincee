import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AiIcon from "@/assets/icons/ai.svg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { createAiTrip } from "@/utils/axiosIntances";

const TripAssistant = () => {
  const [travelPlan, setTravelPlan] = useState("");
  const [showItinerary, setShowItinerary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingFieldValues, setMissingFieldValues] = useState<Record<string, string>>({});
  const [tripResult, setTripResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const buildPromptWithMissingFields = (basePrompt: string) => {
    const extras = Object.entries(missingFieldValues)
      .filter(([, v]) => v.trim().length > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    if (!extras) return basePrompt;
    return `${basePrompt}. Additional details: ${extras}.`;
  };

  const handleGenerateItinerary = async () => {
    if (!travelPlan.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const prompt = buildPromptWithMissingFields(travelPlan);
      const response = await createAiTrip(prompt);
      const payload = response?.data ?? {};
      if (!payload.success) {
        const fields = payload.importantFields || payload.missing || [];
        setMissingFields(fields);
        setShowItinerary(false);
        return;
      }
      setTripResult(payload.data);
      setMissingFields([]);
      setShowItinerary(true);
    } catch (err) {
      setErrorMessage("Failed to generate itinerary. Please try again.");
      console.log('====================================');
      console.log(err.response);
      console.log('====================================');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamplePress = (example) => {
    setTravelPlan(example);
    setMissingFields([]);
    setMissingFieldValues({});
  };

  const missingFieldsLabel = useMemo(() => {
    if (missingFields.length === 0) return null;
    return `Please add: ${missingFields.join(", ")}`;
  }, [missingFields]);

  // Sample itinerary data
  const sampleItinerary = {
    title: "Here's a romantic evening in Ibadan...",
    placesCount: "3 places",
    places: [
      {
        id: 1,
        name: "The Charcoal Grill",
        category: "Dinner",
        description: "Upscale dining with Nigerian fusion cuisine",
        time: "7:00 PM",
        duration: "1.5 hrs",
        distance: "2.3 km",
        rating: "4.8",
        image: require("@/assets/images/sug.jpg"),
      },
      {
        id: 2,
        name: "Agodi Gardens",
        category: "Romantic Spot",
        description: "Scenic garden with night lights and peaceful ambiance",
        time: "9:00 PM",
        duration: "1 hr",
        distance: "3.1 km",
        rating: "4.6",
        image: require("@/assets/images/sug.jpg"),
      },
    ],
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between pt-12 px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        {/* AI Assistant Button */}
        <View className="">
          <LinearGradient
            colors={["#9810FA", "#155DFC"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientButtons}
          >
            <AiIcon width={30} height={25} />
          </LinearGradient>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-5 pt-2 border-b border-gray-300 pb-8 bg-white">
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl font-bold text-gray-900 text-start mb-2">
              Trip Assistant{" "}
            </Text>
            <Image source={require("@/assets/icons/tripA.png")} className="" />
          </View>
          <Text className="text-gray-600 text-start text-lg">
            Let AI plan your perfect itinerary
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-5 pt-6">
          {/* Input Section - ALWAYS VISIBLE */}
          <View className="mb-5 border border-gray-300 rounded-2xl px-6 pt-6 pb-4">
            <Text className="text-gray-700 mb-4 text-lg font-semibold">
              Tell us your travel plan
            </Text>
            <View className="relative">
              <TextInput
                className="border mb-6 border-gray-300 rounded-2xl px-5 py-4 text-gray-900 text-lg bg-white h-32"
                placeholder="Try: 'I'm going to Ibadan for a night date — help me plan'"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={travelPlan}
                onChangeText={setTravelPlan}
                textAlignVertical="top"
              />
              <View className="absolute bg-gray-200 bottom-8 rounded-full p-1 right-3">
                <Ionicons name="mic" size={20} color="#9ca3af" />
              </View>
            </View>
            {missingFieldsLabel && (
              <View className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                <Text className="text-orange-700">{missingFieldsLabel}</Text>
              </View>
            )}
            {missingFields.length > 0 && (
              <View className="gap-3 mb-4">
                {missingFields.map((field) => (
                  <View key={field}>
                    <Text className="text-gray-600 mb-2 capitalize">{field}</Text>
                    <TextInput
                      className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                      placeholder={`Enter ${field}`}
                      value={missingFieldValues[field] || ""}
                      onChangeText={(val) =>
                        setMissingFieldValues((prev) => ({ ...prev, [field]: val }))
                      }
                    />
                  </View>
                ))}
              </View>
            )}
            {errorMessage && (
              <Text className="text-red-500 mb-3">{errorMessage}</Text>
            )}
            {/* Generate Button */}
            <TouchableOpacity onPress={handleGenerateItinerary} disabled={isLoading}>
              <LinearGradient
                colors={["#9810FA", "#155DFC"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientButton}
              >
                <View className="flex-row items-center gap-3">
                  <AiIcon width={30} height={25} />
                  <Text className="text-white text-xl font-bold">
                    {isLoading ? "Generating..." : "Generate Itinerary"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Examples Section - ALWAYS VISIBLE */}
          {!showItinerary && (
            <View className="mb-6">
              <Text className="text-gray-700 text-lg font-base mb-4">
                Try these examples:
              </Text>

              <View className="space-y-4">
                <TouchableOpacity
                  className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
                  onPress={() =>
                    handleExamplePress(
                      "I'm going to Ibadan for a night date — help me plan"
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800 text-base">
                    I'm going to Ibadan for a night date — help me plan
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
                  onPress={() =>
                    handleExamplePress(
                      "Weekend in Calabar with my family — help me plan"
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800 text-base">
                    Weekend in Calabar with my family — help me plan
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
                  onPress={() =>
                    handleExamplePress("3-day solo adventure in Lagos")
                  }
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800 text-base">
                    3-day solo adventure in Lagos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
                  onPress={() =>
                    handleExamplePress(
                      "Romantic getaway to Abuja for our anniversary"
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800 text-base">
                    Romantic getaway to Abuja for our anniversary
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Suggested Itinerary Section - Shows when generated */}
          {showItinerary && (
            <>
              {/* Suggested Itinerary Header */}
              <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Suggested Itinerary
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 text-lg">
                    {tripResult?.summary || sampleItinerary.title}
                  </Text>
                  <Text className="text-gray-500">
                    {tripResult?.trips?.length
                      ? `${tripResult.trips.length} trip(s)`
                      : sampleItinerary.placesCount}
                  </Text>
                </View>
              </View>

              {Array.isArray(tripResult?.trips) && tripResult.trips.length > 0 && (
                <View className="mb-6">
                  {tripResult.trips.map((trip) => (
                    <View
                      key={trip.id}
                      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
                    >
                      <View className="flex-row items-center gap-3">
                        <Image
                          source={{
                            uri:
                              trip.image ||
                              "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
                          }}
                          className="w-16 h-16 rounded-xl"
                          resizeMode="cover"
                        />
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-gray-900">
                            {trip.name}
                          </Text>
                          <Text className="text-gray-600">
                            {trip.destination} • {trip.duration}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Itinerary Places */}
              <View className="space-y-6 mb-8">
                {sampleItinerary.places.map((place) => (
                 <View
  key={place.id}
  className="bg-white rounded-2xl my-3 shadow-sm border border-gray-200 overflow-hidden"
>
  {/* TOP CONTENT */}
  <View className="flex-row p-4">
    {/* Image */}
    <Image
      source={place.image}
      className="w-28 h-28 rounded-xl"
      resizeMode="cover"
    />

    {/* Right Content */}
    <View className="flex-1 ml-4 justify-between">
      {/* Title + Close (optional) */}
      <Text className="text-black text-xl font-bold">
        {place.name}
      </Text>

      {/* Category Badge */}
      <View className="self-start bg-orange-100 px-3 py-1 rounded-full mt-1">
        <Text className="text-orange-600 text-sm font-medium">
          {place.category}
        </Text>
      </View>

      {/* Description */}
      <Text
        className="text-gray-600 text-sm mt-2"
        numberOfLines={2}
      >
        {place.description}
      </Text>

      {/* Meta Info */}
      <View className="flex-row items-center mt-3">
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text className="text-gray-700 ml-1 text-sm">
          {place.time}
        </Text>

        <Text className="text-gray-400 mx-2">•</Text>

        <Text className="text-gray-700 text-sm">
          {place.duration}
        </Text>

        <Text className="text-gray-400 mx-2">•</Text>

        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text className="text-gray-700 ml-1 text-sm">
          {place.distance}
        </Text>
      </View>

      {/* Rating */}
      <View className="flex-row items-center mt-2">
        <Ionicons name="star" size={18} color="#fbbf24" />
        <Text className="text-gray-800 text-base font-semibold ml-1">
          {place.rating}
        </Text>
      </View>
    </View>
  </View>

  {/* BOTTOM ACTIONS */}
  <View className="flex-row items-center p-4 border-t border-gray-200">
    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-blue-600 py-3 rounded-xl mr-3">
      <Ionicons name="add" size={20} color="white" />
      <Text className="text-white font-semibold ml-2">
        Add to Trip
      </Text>
    </TouchableOpacity>

    <TouchableOpacity className="flex-row items-center justify-center px-4 py-3 border border-gray-300 rounded-xl">
      <Ionicons name="swap-horizontal-outline" size={20} color="#374151" />
      <Text className="text-gray-700 font-medium ml-2">
        Replace
      </Text>
    </TouchableOpacity>
  </View>
</View>

                ))}
              </View>         
                 <LinearGradient
  colors={["#F3E8FF", "#FCE7F3"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientButtonJoin}
>
  {/* Close Icon */}
  <TouchableOpacity
    className="absolute top-5 right-5 z-10"
    onPress={() => console.log("Dismiss")}
  >
    <Ionicons name="close" size={26} color="#7C3AED" />
  </TouchableOpacity>

  <View className="flex-row items-start gap-4">
    {/* Left Icon Circle */}
    <View className="w-14 h-14 rounded-full bg-purple-600 items-center justify-center">
      <Ionicons name="people-outline" size={26} color="#fff" />
    </View>

    {/* Content */}
    <View className="flex-1">
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        Join a Group Trip
      </Text>

      <Text className="text-gray-700 text-lg leading-6 mb-6">
        Others are planning trips to Ibadan too — want to link up?
      </Text>

      {/* CTA Button */}
      <TouchableOpacity>
        <LinearGradient
          colors={["#7C3AED", "#9333EA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.exploreButton}
        >
          <Text className="text-white text-lg font-semibold">
            Explore Group Trips
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
</LinearGradient>

              {/* View Full Itinerary Button */}
              <View className="flex-row justify-between">
                    <View className="flex-row gap-5">
                        <Ionicons name="refresh" size={24} color="#000" className="bg-transparent border-2 border-gray-300 w-16 h-16 pt-4 items-center text-center justify-center rounded-xl" />
                        <Ionicons name="share-social-outline" size={24} color="#000" className="bg-transparent border-2 border-gray-300 w-16 h-16 pt-4 items-center text-center justify-center rounded-xl" />
                    </View>
              <TouchableOpacity
                className="mb-8"
                onPress={() => console.log("View full itinerary")}
              >
                <LinearGradient
                  colors={["#9810FA", "#155DFC"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientButton}
                >
                    <View className="flex-row gap-5">
                        <Ionicons name="save" size={24} color="#fff"  />
                  <Text className="text-white text-xl font-bold">
                   Save Itinerary
                  </Text>
                    </View>
                </LinearGradient>
              </TouchableOpacity>
              </View>

              {/* Try Another Example */}
              <View className="mb-10">
                <Text className="text-gray-700 text-lg font-base mb-4">
                  Try another example:
                </Text>
                <View className="space-y-3">
                  <TouchableOpacity
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3"
                    onPress={() =>
                      handleExamplePress(
                        "Weekend in Calabar with my family — help me plan"
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-800">
                      Weekend in Calabar with my family — help me plan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3"
                    onPress={() =>
                      handleExamplePress("3-day solo adventure in Lagos")
                    }
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-800">
                      3-day solo adventure in Lagos
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    height: 56,
  },
  gradientButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 999,
    height: 40,
    width: 40,
  },
    gradientButtonJoin: {
  padding: 24,
  borderRadius: 20,
  width: "100%",
  marginBottom: 24,
  borderColor: "#E0BBF6",
  borderWidth: 1,
},

exploreButton: {
  alignSelf: "flex-start",
  paddingHorizontal: 28,
  paddingVertical: 14,
  borderRadius: 16,
},

});

export default TripAssistant;
