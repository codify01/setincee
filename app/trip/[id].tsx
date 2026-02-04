import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, Tabs } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");

interface Activity {
  id: string;
  name: string;
  type: string;
  time: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
}

interface Place {
  id: string;
  name: string;
  type: string;
  rating: number;
  time: string;
  image: string;
  day: number;
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
}

const mockItinerary: DayPlan[] = [
  {
    date: "Wednesday, Jan 1",
    activities: [
      {
        id: "a1",
        name: "Jollof Junction",
        type: "Nigerian Cuisine",
        time: "10:00 AM",
      },
      {
        id: "a2",
        name: "Nike Art Gallery",
        type: "Art & Culture",
        time: "2:00 PM",
      },
    ],
  },
  {
    date: "Thursday, Jan 2",
    activities: [
      {
        id: "a3",
        name: "Visit local markets",
        type: "Explore traditional Nigerian markets",
        time: "10:00 AM",
      },
      {
        id: "a4",
        name: "Beach sunset picnic",
        type: "Watch sunset at Elegushi Beach",
        time: "6:00 PM",
      },
    ],
  },
  {
    date: "Friday, Jan 3",
    activities: [], // No plans for this day
  },
  {
    date: "Friday, Jan 4",
    activities: [], // No plans for this day
  },
  {
    date: "Friday, Jan 5",
    activities: [], // No plans for this day
  },
  {
    date: "Friday, Jan 6",
    activities: [], // No plans for this day
  },
];

const mockPlaces: Place[] = [
  {
    id: "p1",
    name: "Jolof Junction",
    type: "Nigerian Cuisine",
    rating: 4.8,
    time: "10:00 AM",
    day: 1,
    image:
      "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
  },
  {
    id: "p2",
    name: "Nike Art Gallery",
    type: "Art & Culture",
    rating: 4.1,
    time: "2:00 PM",
    day: 2,
    image:
      "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135844/samples/balloons.jpg",
  },
];

const mockTodoItems: TodoItem[] = [
  {
    id: "t1",
    title: "Visit local markets",
    description: "Explore traditional Nigerian markets",
    date: "Jan 2",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "t2",
    title: "Beach sunset picnic",
    description: "Watch sunset at Elegushi Beach",
    date: "Jan 2",
    time: "6:00 PM",
    completed: true,
  },
];

const TripOverview: React.FC = () => {
  const {
    tripName,
    destination,
    startDate,
    endDate,
    travelers,
    description,
    tripType,
  } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState("Overview"); // Default active tab
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityDate, setNewActivityDate] = useState<Date | null>(null);
  const [newActivityTime, setNewActivityTime] = useState<Date | null>(null);
  const [showNewActivityDatePicker, setShowNewActivityDatePicker] =
    useState(false);
  const [showNewActivityTimePicker, setShowNewActivityTimePicker] =
    useState(false);
  const [todoItems, setTodoItems] = useState<TodoItem[]>(mockTodoItems);

  const mockTripDetails = {
    id: "1",
    name: tripName || "Summer Vacation",
    destination: destination || "Cape Town, South Africa",
    startDate: startDate
      ? new Date(startDate as string).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "02/02/2026",
    endDate: endDate
      ? new Date(endDate as string).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "02/17/2026",
    duration: "15 days",
    travelers: travelers || 1,
    image:
      "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
    placesAdded: 2,
    activities: 2,
    completed: 0,
  };

  const renderItineraryActivity = (activity: Activity) => (
    <View
      key={activity.id}
      className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="flex-row gap-3 items-center">
          <Image
            source={{
              uri: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
            }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {activity.name}
          </Text>
          <Text className="text-gray-600 text-sm">{activity.type}</Text>
          <View className="flex-row gap-1 pt-1 items-center">
            <Ionicons name="time-outline" size={16} color="#155DFC" />
            <Text className="text-blue-600 font-semibold text-base">
              {activity.time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPlaceItem = (place: Place) => (
    <View
      key={place.id}
      className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <Image
        source={{ uri: place.image }}
        className="w-16 h-16 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900">{place.name}</Text>
        <Text className="text-gray-600 text-sm mb-1">{place.type}</Text>
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text className="ml-1 font-semibold text-gray-700">
            {place.rating}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {/* Days */}
          <View className="flex-row gap-2">
            <Text className="text-gray-500">Day {place.day}</Text>
            <Text>.</Text>
          </View>
          {/* Time */}
          <View className="flex-row">
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-500 text-sm">{place.time}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="trash" size={24} color="#E7000B" />
      </TouchableOpacity>
    </View>
  );

  const toggleTodoCompletion = (id: string) => {
    setTodoItems(
      todoItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const addTodoActivity = () => {
    if (!newActivityTitle.trim() || !newActivityDate || !newActivityTime) {
      alert("Please fill in title, date and time for the activity.");
      return;
    }

    const newTodo: TodoItem = {
      id: String(todoItems.length + 1),
      title: newActivityTitle,
      description: newActivityDescription,
      date: newActivityDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      time: newActivityTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      completed: false,
    };
    setTodoItems([...todoItems, newTodo]);
    setNewActivityTitle("");
    setNewActivityDescription("");
    setNewActivityDate(null);
    setNewActivityTime(null);
    setShowAddActivityModal(false);
  };

  const completedTasks = todoItems.filter((item) => item.completed).length;
  const totalTasks = todoItems.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const onNewActivityDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || newActivityDate;
    setShowNewActivityDatePicker(false);
    setNewActivityDate(currentDate);
  };

  const onNewActivityTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || newActivityTime;
    setShowNewActivityTimePicker(false);
    setNewActivityTime(currentTime);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <ScrollView className="p-5">
            <View className="bg-[#F8FAFC]  rounded-xl p-4 mb-6">
              <Text className="text-2xl font-medium text-gray-900 mb-4">
                Trip Details
              </Text>
              <View className="">
                <View className="text-gray-700 text-base mb-2 flex-row justify-between">
                  <Text className="font-semibold">Start Date:</Text>
                  <Text>{mockTripDetails.startDate}</Text>
                </View>
                <View className="text-gray-700 text-base mb-2 flex-row justify-between">
                  <Text className="font-semibold">End Date:</Text>
                  <Text>{mockTripDetails.endDate}</Text>
                </View>
                <View className="text-gray-700 text-base mb-2 flex-row justify-between">
                  <Text className="font-semibold">Duration:</Text>
                  <Text>{mockTripDetails.duration}</Text>
                </View>
                <View className="text-gray-700 text-base mb-2 flex-row justify-between">
                  <Text className="font-semibold">Travelers:</Text>
                  <Text>
                    {mockTripDetails.travelers} person
                    {Number(mockTripDetails.travelers) > 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-[#F8FAFC]  rounded-xl p-4 mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Quick Stats
              </Text>

              {/* +++ */}
              <View className="flex-row  gap-10">
                <View className="flex-col mb-2 h-28 w-44 bg-white rounded-md p-3">
                  <Text className="text-gray-500 text-md">Places Added</Text>
                  <Text className="text-black text-2xl font-semibold">
                    {mockTripDetails.placesAdded}
                  </Text>
                </View>
                <View className="flex-col mb-2 h-28 w-44 bg-white rounded-md p-3">
                  <Text className="text-gray-500 text-md">Activities</Text>
                  <Text className="text-black text-2xl font-semibold">
                    {mockTripDetails.activities}
                  </Text>
                </View>
              </View>
              {/* ++++++ */}
              <View className="flex-row gap-10">
                <View className="flex-col mb-2 h-28 w-44 bg-white rounded-md p-3">
                  <Text className="text-gray-500 text-md">Completed</Text>
                  <Text className="text-black text-2xl font-semibold">
                    {mockTripDetails.completed}
                  </Text>
                </View>
                <View className="flex-col mb-2 h-28 w-44 bg-white rounded-md p-3">
                  <Text className="text-gray-500 text-md">Remaining</Text>
                  <Text className="text-black text-2xl font-semibold">
                    {mockTripDetails.completed}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case "Itinerary":
        return (
          <ScrollView
            className="flex-1 p-5"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row justify-between mb-4">
              <Text className="text-xl text-gray-900 ">Day-by-Day Plan </Text>
              <Text className="text-gray-500 text-md">
                {mockItinerary.length} days total
              </Text>
            </View>
            {mockItinerary.map((day, index) => (
              <View key={index} className="mb-6">
                <View className="bg-[#F8FAFC] p-4 rounded-xl">
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-lg font-bold text-gray-800">
                        Day {index + 1}
                      </Text>
                      <Text className="text-gray-500 mb-2">{day.date}</Text>
                    </View>
                    {/* <View className='bg-[#DBEAFE] p-2 text-center rounded-2xl px-4 mb-4'>
                                           <Text className='text-blue-600'>2 times</Text> 
                                        </View> */}
                  </View>

                  {day.activities.length > 0 ? (
                    day.activities.map(renderItineraryActivity)
                  ) : (
                    <View className="bg-gray-50 rounded-xl p-4 items-center justify-center border border-gray-200">
                      <Text className="text-gray-500 mb-2">
                        No plans for this day yet
                      </Text>
                      <TouchableOpacity className="bg-blue-100 rounded-full px-4 py-2">
                        <Text className="text-blue-600 font-semibold">
                          Add Items
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        );
      case "Places":
        return (
          <ScrollView
            className="flex-1 p-5"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Places to Visit
              </Text>
              <TouchableOpacity className="bg-blue-600 rounded-full px-4 py-2 flex-row items-center">
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold ml-1">Add Place</Text>
              </TouchableOpacity>
            </View>
            {mockPlaces.map(renderPlaceItem)}
          </ScrollView>
        );
      case "To-Do":
        return (
          <View className="flex-1 p-5" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Things to Do
              </Text>
              <TouchableOpacity
                className="bg-blue-600 rounded-full px-4 py-2 flex-row items-center"
                onPress={() => setShowAddActivityModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold ml-1">
                  Add Activity
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View className="mb-6">
              <View className="flex-row justify-between mb-2">
                <Text className="text-right text-gray-600 text-sm">
                  {completedTasks} of {totalTasks} completed
                </Text>
                <Text className="text-right text-gray-600 text-sm">
                  ({progress.toFixed(0)}%)
                </Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full mb-2">
                <View
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>

            {/* To-Do List */}
             <ScrollView
                 className="p-1"
            showsVerticalScrollIndicator={false}>
            {todoItems.length > 0 ? (
              todoItems.map((item) => (
               

               
                <TouchableOpacity
                  key={item.id}
                  className="flex-row  bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                  onPress={() => toggleTodoCompletion(item.id)}

                >
                  <Ionicons
                    name={item.completed ? "ellipse" : "ellipse-outline"}
                    size={24}
                    color={item.completed ? "#155DFC" : "#6b7280"}
                    className="mr-4"
                  />

                  <View className="flex-1">
                    <Text
                      className={`text-lg font-bold ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className={`text-gray-600 text-sm ${item.completed ? "line-through" : ""}`}
                    >
                      {item.description}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {item.date} at {item.time}
                    </Text>
                  </View>
                  <Ionicons
                    name="trash"
                    size={24}
                    color={"#E7000B"}
                    className="mr-4"
                  />
                </TouchableOpacity>
             
              ))
            ) : (
              <View className="bg-gray-50 rounded-xl p-8 items-center">
                <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-700 mt-4 text-lg font-medium">
                  No to-do items yet
                </Text>
                <Text className="text-gray-500 mt-2 text-center">
                  Add activities to keep track of your trip planning.
                </Text>
              </View>
            )}
</ScrollView>
            {/* Add Activity Modal */}
            <Modal
              visible={showAddActivityModal}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setShowAddActivityModal(false)}
            >
              <View className="flex-1 bg-[#f3f7fa] pt-12 px-5">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-xl font-bold text-gray-900">
                    Add New Activity
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowAddActivityModal(false)}
                  >
                    <Ionicons name="close" size={28} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="mb-4">
                    <Text className="text-gray-700 text-base font-semibold mb-2">
                      Activity Title
                    </Text>
                    <TextInput
                      className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900"
                      placeholder="e.g., Book flights"
                      placeholderTextColor="#9ca3af"
                      value={newActivityTitle}
                      onChangeText={setNewActivityTitle}
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-700 text-base font-semibold mb-2">
                      Description
                    </Text>
                    <TextInput
                      className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 h-24"
                      placeholder="Optional description"
                      placeholderTextColor="#9ca3af"
                      value={newActivityDescription}
                      onChangeText={setNewActivityDescription}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-700 text-base font-semibold mb-2">
                      Select Date
                    </Text>
                    <TouchableOpacity
                      className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base justify-center"
                      onPress={() => setShowNewActivityDatePicker(true)}
                    >
                      <Text
                        className={
                          newActivityDate ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {newActivityDate
                          ? newActivityDate.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "MM/DD/YYYY"}
                      </Text>
                    </TouchableOpacity>
                    {showNewActivityDatePicker && (
                      <DateTimePicker
                        value={newActivityDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onNewActivityDateChange}
                      />
                    )}
                  </View>

                  <View className="mb-6">
                    <Text className="text-gray-700 text-base font-semibold mb-2">
                      Add Time
                    </Text>
                    <TouchableOpacity
                      className="w-full bg-white border border-gray-300 rounded-xl p-4 text-base justify-center"
                      onPress={() => setShowNewActivityTimePicker(true)}
                    >
                      <Text
                        className={
                          newActivityTime ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {newActivityTime
                          ? newActivityTime.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "HH:MM AM/PM"}
                      </Text>
                    </TouchableOpacity>
                    {showNewActivityTimePicker && (
                      <DateTimePicker
                        value={newActivityTime || new Date()}
                        mode="time"
                        display="default"
                        onChange={onNewActivityTimeChange}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    className="w-full h-14 bg-blue-600 rounded-full flex-row items-center justify-center mb-6"
                    onPress={addTodoActivity}
                  >
                    <Text className="text-white text-lg font-semibold">
                      Add Activity
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Modal>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="w-full h-96 relative">
        <Image
          source={{
            uri: "https://res.cloudinary.com/dpffwzcd8/image/upload/v1712135830/samples/landscapes/nature-mountains.jpg",
          }}
          alt="hero image"
          className="w-full h-96 absolute top-0 "
          resizeMode="cover"
        />

        {/* Overlay and Back/Menu Buttons */}
        {/* <View className="absolute top-0 w-full h-60 bg-black opacity-30"></View> */}
        <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 bg-white rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View className="bg-[#155DFC] px-5 py-3 rounded-full">
            <Text className="text-white">Upcoming Trip</Text>
          </View>

          <TouchableOpacity className="p-2 bg-white rounded-full">
            <Ionicons name="ellipsis-vertical" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
        {/* The Name */}
      </View>

      {/* Trip Info Card */}
      <View className="rounded-t-3xl -mt-20 flex-1">
        <View className="px-2 pb-4">
          <Text className="text-2xl font-bold text-white mb-1">
            {mockTripDetails.name}
          </Text>
          <Text className=" text-base text-white mb-4">
            {mockTripDetails.destination}
          </Text>
          <View className="flex-row items-center gap-3 relative  bottom-4 justify-around">
            <View className="items-start leading-4 bg-white h-20 w-32 rounded-xl justify-center p-2 shadow-sm ">
              <Ionicons name="calendar-outline" size={20} color="#155DFC" />
              <Text className="text-gray-500 text-sm">Duration</Text>
              <Text className="text-gray-900 text-sm">
                {mockTripDetails.duration}
              </Text>
            </View>
            <View className="items-start bg-white h-20 w-32 rounded-xl justify-center p-2 shadow-sm ">
              <Ionicons name="person-outline" size={20} color="#155DFC" />
              <Text className="text-gray-500 text-sm">Traveler</Text>
              <Text className="text-gray-900 text-sm">
                {mockTripDetails.travelers}
              </Text>
            </View>
            <View className="items-start bg-white h-20 w-32 rounded-xl justify-center p-2 shadow-sm ">
              <Ionicons name="map-outline" size={20} color="#155DFC" />
              <Text className="text-gray-500 text-sm">Places</Text>
              <Text className="text-gray-900 text-sm">
                {mockTripDetails.placesAdded}{" "}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5"
          >
            {["Overview", "Itinerary", "Places", "To-Do"].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`py-3 px-4 ${activeTab === tab ? "border-b-2 border-blue-600" : ""}`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`text-base font-semibold ${activeTab === tab ? "text-blue-600" : "text-gray-600"}`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="flex-1">{renderTabContent()}</View>
      </View>
    </View>
  );
};

export default TripOverview;
