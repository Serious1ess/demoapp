import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useUser } from "../../context/UserContext";
import { createAppointment } from "../../supabase/busuniss";

type RootStackParamList = {
  Home: undefined;
  Appointments: undefined;
  ServiceSelection: { customer: Customer };
  DateTimeSelection: { customer: Customer; selectedServices: Service[] };
  AppointmentConfirmation: {
    customer: Customer;
    selectedServices: Service[];
    selectedDate: string;
    selectedTime: string;
  };
};

type AppointmentConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppointmentConfirmation"
>;

type AppointmentConfirmationRouteProp = RouteProp<
  RootStackParamList,
  "AppointmentConfirmation"
>;

interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const AppointmentConfirmationScreen = () => {
  const navigation = useNavigation<AppointmentConfirmationNavigationProp>();
  const route = useRoute<AppointmentConfirmationRouteProp>();
  const { user } = useUser();
  const { customer, selectedServices, selectedDate, selectedTime } =
    route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals safely
  const { totalPrice, totalDuration } = selectedServices.reduce(
    (acc, service) => ({
      totalPrice: acc.totalPrice + Number(service.price),
      totalDuration: acc.totalDuration + Number(service.duration),
    }),
    { totalPrice: 0, totalDuration: 0 }
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!user?.id) throw new Error("You must be logged in");
      if (!customer?.id) throw new Error("Business information missing");

      // Use the existing function
      const result = await createAppointment(
        customer.id, // businessId
        selectedDate,
        selectedTime,
        selectedServices.map((s) => s.id)
      );
      console.log("Appointment Booked");
      Alert.alert(
        "Appointment Booked",
        `Your ${formatTime(totalDuration)} appointment with ${
          customer.full_name
        } is confirmed!`,
        [
          {
            text: "View Appointments",
            onPress: () => navigation.navigate("Appointments"),
          },
          {
            text: "Done",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.log("Booking Failed");
      Alert.alert(
        "Booking Failed",
        error.message || "Could not complete booking",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow bg-white p-4 ${
        Platform.OS === "ios" ? "pt-12" : "pt-4"
      }`}>
      {/* Business Info */}
      <View
        style={tw`bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500 shadow-sm`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
          {customer.full_name}
        </Text>
        <Text style={tw`text-base text-gray-600`}>Phone: {customer.phone}</Text>
      </View>

      {/* Appointment Details */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Details</Text>

        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={tw`text-base font-medium text-gray-600`}>Date:</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {selectedDate}
          </Text>
        </View>

        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={tw`text-base font-medium text-gray-600`}>Time:</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {selectedTime}
          </Text>
        </View>

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-base font-medium text-gray-600`}>Duration:</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {formatTime(totalDuration)}
          </Text>
        </View>
      </View>

      {/* Services Summary */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Services</Text>
        <ScrollView style={tw`max-h-40 bg-gray-50 rounded-lg p-2 shadow-sm`}>
          {selectedServices.map((service) => (
            <View
              key={service.id}
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-base text-gray-800`}>{service.name}</Text>
                <Text style={tw`text-xs text-gray-500`}>
                  {formatTime(service.duration)} • {service.price} TL
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={tw`flex-row justify-between items-center mt-4`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>Total:</Text>
          <Text style={tw`text-lg font-bold text-blue-800`}>
            {totalPrice} TL
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        {/* <TouchableOpacity
          style={tw`flex-1 bg-gray-100 border border-gray-300 rounded-lg py-3 mx-2 items-center`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-base font-semibold text-gray-800`}>Back</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={tw`flex-1 bg-green-500 rounded-lg py-3 mx-2 items-center shadow-lg ${
            isSubmitting ? "opacity-70" : ""
          }`}
          onPress={handleConfirm}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={tw`text-base font-semibold text-white`}>
              Confirm Booking
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AppointmentConfirmationScreen;
