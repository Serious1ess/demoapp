import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import DatePickerWeb from "react-datepicker"; // For web
import "react-datepicker/dist/react-datepicker.css"; // CSS for web date picker

import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../globle.css"; // Adjust the path as needed
// import DatePicker from "react-native-date-picker"; // For Android and iOS
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "tailwind-react-native-classnames";
// Define the types for our navigation parameters
type RootStackParamList = {
  Home: undefined;
  ServiceSelection: { customer: Customer };
  DateTimeSelection: { customer: Customer; selectedServices: Service[] };
  AppointmentConfirmation: {
    customer: Customer;
    selectedServices: Service[];
    selectedDate: string;
    selectedTime: string;
  };
};

// Define the navigation prop type for this screen
type DateTimeSelectionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DateTimeSelection"
>;

// Define the route prop type for this screen
type DateTimeSelectionRouteProp = RouteProp<
  RootStackParamList,
  "DateTimeSelection"
>;

interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  selected?: boolean;
}

interface TimeSlot {
  time: string;
  isBusy: boolean;
}

const DateTimeSelectionScreen = () => {
  const navigation = useNavigation<DateTimeSelectionNavigationProp>();
  const route = useRoute<DateTimeSelectionRouteProp>();
  const { customer, selectedServices } = route.params;

  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDateObj(date);
      const selectedDateString = date.toISOString().split("T")[0];
      setSelectedDate(selectedDateString);
    }
    setShowDatePicker(false);

    // Mock business hours (9 AM - 5 PM) with some busy slots
    const workingHours = Array.from({ length: 9 }, (_, i) => i + 9); // [9,10,11,...,17]
    const busyHours = [10, 14]; // Example: Busy at 10 AM & 2 PM

    const formattedHours = workingHours.map((hour) => ({
      time: `${hour}:00`,
      isBusy: busyHours.includes(hour),
    }));

    setAvailableHours(formattedHours);
  };

  const handleNext = () => {
    if (selectedTime) {
      navigation.navigate("AppointmentConfirmation", {
        customer,
        selectedServices,
        selectedDate,
        selectedTime,
      });
    } else {
      // Show error or prompt user to select a time
      alert("Please select a time slot");
    }
  };

  // Platform-specific date picker
  const renderDatePicker = () => {
    if (Platform.OS === "web") {
      return (
        <div style={tw`w-full`}>
          <DatePickerWeb
            selected={selectedDateObj}
            onChange={(date: Date | null) => handleDateSelect(date)}
            inline // Show the calendar inline
          />
        </div>
      );
    } else {
      return showDatePicker ? (
        <DateTimePicker
          value={selectedDateObj}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) handleDateSelect(date);
          }}
        />
      ) : null;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow bg-white p-4 ${
        Platform.OS === "ios" ? "pt-12" : "pt-4"
      }`}>
      <Text style={tw`text-2xl font-bold text-center text-gray-800 mb-4`}>
        Schedule Appointment
      </Text>

      {/* Customer Info */}
      <View
        style={tw`bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500 shadow-sm`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
          {customer?.full_name}
        </Text>
        <Text style={tw`text-base text-gray-600`}>
          Phone: {customer?.phone}
        </Text>
      </View>

      {/* Selected Services Summary */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Selected Services:
        </Text>
        <ScrollView style={tw`max-h-40 bg-gray-50 rounded-lg p-2 shadow-sm`}>
          {selectedServices.map((service) => (
            <View
              key={service.id}
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}>
              <Text style={tw`text-base text-gray-800`}>{service.name}</Text>
              <Text style={tw`text-base font-semibold text-blue-800`}>
                ${service.price}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Date Selection */}
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        Choose Your Preferred Date:
      </Text>
      <View style={tw`mb-6`}>
        <TouchableOpacity
          style={[
            tw`bg-blue-50 p-3 rounded-lg border border-blue-500 items-center`,
            Platform.OS === "web" ? { display: "none" } : {},
          ]}
          onPress={() => setShowDatePicker(true)}>
          <Text style={tw`text-base font-semibold text-blue-800`}>
            Open Calendar
          </Text>
        </TouchableOpacity>

        {selectedDate && (
          <Text
            style={tw`text-base font-bold text-blue-800 mt-4 bg-blue-100 p-3 rounded-lg text-center`}>
            Date: {selectedDate}
          </Text>
        )}

        {/* Render the platform-specific date picker */}
        {renderDatePicker()}
      </View>

      {/* Time Slots */}
      {selectedDate && availableHours.length > 0 && (
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            Select a Time Slot
          </Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {availableHours.map((item) => (
              <TouchableOpacity
                key={item.time}
                style={[
                  tw`p-3 m-1 rounded-lg items-center justify-center w-1/3`,
                  item.isBusy
                    ? tw`bg-red-100 border-red-300`
                    : tw`bg-green-100 border-green-300`,
                  selectedTime === item.time && tw`bg-blue-100 border-blue-500`,
                ]}
                disabled={item.isBusy}
                onPress={() => setSelectedTime(item.time)}>
                <Text
                  style={[
                    tw`text-base font-medium`,
                    item.isBusy ? tw`text-gray-500` : tw`text-gray-800`,
                  ]}>
                  {item.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTime && (
            <Text
              style={tw`text-base font-bold text-blue-800 mt-4 bg-blue-100 p-3 rounded-lg text-center`}>
              Selected Time: {selectedTime}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-100 border border-gray-300 rounded-lg py-3 mx-2 items-center`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-base font-semibold text-gray-800`}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-blue-500 rounded-lg py-3 mx-2 items-center shadow-lg`}
          onPress={handleNext}
          disabled={!selectedTime}>
          <Text style={tw`text-base font-semibold text-white`}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DateTimeSelectionScreen;
