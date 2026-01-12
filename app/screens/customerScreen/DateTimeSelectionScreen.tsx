import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { isBefore, isSameDay } from "date-fns";
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

// import DatePicker from "react-native-date-picker"; // For Android and iOS
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../supabase/supabase";
import tw from "../../utils/style/tw";
// Define the types for our navigation parameters
type RootStackParamList = {
  Home: undefined;
  ServiceSelection: { customer: Customer };
  DateTimeSelection: {
    customer: Customer;
    selectedServices: Service[];
    customerServices: [];
  };
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
  const { customer, selectedServices, customerServices } = route.params;
  const [loading, setLoading] = useState(false);
  const bussisHours = customerServices.business_hours;

  const openedDays = customerServices.business_days_open;
  const openedDayNumbers = openedDays
    .map((day) => {
      switch (day.toLowerCase()) {
        case "sunday":
          return 0;
        case "monday":
          return 1;
        case "tuesday":
          return 2;
        case "wednesday":
          return 3;
        case "thursday":
          return 4;
        case "friday":
          return 5;
        case "saturday":
          return 6;
        default:
          return -1;
      }
    })
    .filter((num) => num !== -1);
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the future or today
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return false;
    }

    // Check if day of week is an open day
    const dayOfWeek = date.getDay();
    return openedDayNumbers.includes(dayOfWeek);
  };
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    if (!isDateSelectable(date)) {
      alert("Please select a business open day");
      return;
    }

    setSelectedDateObj(date);
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowDatePicker(false);

    // Generate time slots based on business hours
    generateTimeSlots(date);
  };

  const generateTimeSlots = async (date: Date) => {
    if (!customerServices?.business_hours) {
      setAvailableHours([]);
      return;
    }

    try {
      const { data: timeSlots, error } = await supabase.rpc(
        "get_accurate_time_slots",
        {
          business_id_param: customer.id,
          selected_date_param: date.toISOString().split("T")[0],
          business_open_time_param: customerServices.business_hours.open,
          business_close_time_param: customerServices.business_hours.close,
          time_slot_interval_param: 30, // or whatever interval you prefer
        }
      );

      if (error) throw error;

      const formattedSlots = timeSlots.map((slot) => ({
        time: slot.time_slot.split(":").slice(0, 2).join(":"),
        isBusy: !slot.is_available,
        status: slot.status,
      }));

      setAvailableHours(formattedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setAvailableHours([]);
      alert("Failed to load available time slots. Please try again.");
    }
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
            onChange={handleDateSelect}
            inline
            minDate={new Date()}
            filterDate={isDateSelectable}
            highlightDates={openedDayNumbers.map((day) => ({
              [day]: { backgroundColor: "#3b82f6", color: "white" },
            }))}
          />
        </div>
      );
    } else {
      return showDatePicker ? (
        <DateTimePicker
          value={selectedDateObj}
          mode="date"
          minimumDate={new Date()}
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
      {/* Customer Info */}
      <View style={tw`bg-primary-100 p-4 rounded-lg mb-6 shadow-sm`}>
        <Text style={tw`text-lg  text-gray-800 mb-2`}>
          Business Name:{" "}
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
            {customer?.full_name}
          </Text>
        </Text>

        {/* <Text style={tw`text-base text-gray-600`}>
          Phone: {customer?.phone}
        </Text> */}
        <Text style={tw`text-base text-gray-600`}>
          {selectedServices.map((service) => (
            <View
              key={service.id}
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}>
              <Text style={tw`text-base text-gray-800`}>{service.name}: </Text>
              <Text style={tw`text-base font-semibold text-primary-800`}>
                {service.price} TL
              </Text>
            </View>
          ))}
        </Text>
      </View>

      {/* Selected Services Summary */}
      {/* <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Selected Services:
        </Text>
        <ScrollView style={tw`max-h-40 bg-gray-50 rounded-lg p-2 shadow-sm`}>
          {selectedServices.map((service) => (
            <View
              key={service.id}
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}>
              <Text style={tw`text-base text-gray-800`}>{service.name}</Text>
              <Text style={tw`text-base font-semibold text-primary-800`}>
                ${service.price}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View> */}

      {/* Date Selection */}
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        Choose Your Preferred Date:
      </Text>
      <View style={tw`mb-6`}>
        <TouchableOpacity
          style={[
            tw`bg-primary-50 p-3 rounded-lg border border-primary-500 items-center`,
            Platform.OS === "web" ? { display: "none" } : {},
          ]}
          onPress={() => setShowDatePicker(true)}>
          <Text style={tw`text-base font-semibold text-primary-800`}>
            Open Calendar
          </Text>
        </TouchableOpacity>

        {selectedDate && (
          <Text
            style={tw`text-base font-bold text-primary-800 mt-4 bg-primary-100 p-3 rounded-lg text-center`}>
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
                  selectedTime === item.time &&
                    tw`bg-primary-100 border-primary-500`,
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
              style={tw`text-base font-bold text-primary-800 mt-4 bg-primary-100 p-3 rounded-lg text-center`}>
              Selected Time: {selectedTime}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        {/* <TouchableOpacity
          style={tw`flex-1 bg-gray-100 border border-gray-300 rounded-lg py-3 mx-2 items-center`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-base font-semibold text-gray-800`}>Back</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={tw`flex-1 bg-primary-500 rounded-lg py-3 mx-2 items-center shadow-lg`}
          onPress={handleNext}
          disabled={!selectedTime}>
          <Text style={tw`text-base font-semibold text-white`}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DateTimeSelectionScreen;
