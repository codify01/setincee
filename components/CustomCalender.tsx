import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  // Generate all days for the current month
  const generateDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray = [];

    // Add blank days for offset
    for (let i = 0; i < firstDay.getDay(); i++) {
      daysArray.push(null);
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i));
    }

    setDays(daysArray);
  };

  useEffect(() => {
    generateDays(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(nextMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate?.toDateString() === date?.toDateString();
  };

  return (
    <View className="bg-white rounded-xl p-4">
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text className="text-pry text-lg font-bold">&lt;</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text className="text-pry text-lg font-bold">&gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View className="flex-row justify-between mb-2">
        {WEEK_DAYS.map((day) => (
          <Text key={day} className="text-gray-500 font-medium w-10 text-center">{day}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <FlatList
        data={days}
        keyExtractor={(_, index) => index.toString()}
        numColumns={7}
        
        renderItem={({ item }) => {
          if (!item) {
            return <View className="w-10 h-10" />;
          }
          const today = isToday(item);
          const selected = isSelected(item);
          return (
            <TouchableOpacity
              onPress={() => onDateSelect(item)}
              className={`w-10 h-10 m-0.5 justify-center items-center rounded-full
                ${selected ? "bg-pry" : ""}
                ${today && !selected ? "border border-pry" : ""}`}
            >
              <Text className={`${selected ? "text-white" : "text-gray-800"} text-center`}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CustomCalendar;
