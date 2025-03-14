import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
type AppointmentConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppointmentConfirmation"
>;

// Define the route prop type for this screen
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
  id: number;
  name: string;
  price: number;
  selected?: boolean;
}

const AppointmentConfirmationScreen = () => {
  const navigation = useNavigation<AppointmentConfirmationNavigationProp>();
  const route = useRoute<AppointmentConfirmationRouteProp>();
  const { customer, selectedServices, selectedDate, selectedTime } =
    route.params;

  // Calculate total price
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const handleConfirm = () => {
    // Here you would typically send the data to your backend
    Alert.alert(
      "Appointment Confirmed",
      "Your appointment has been successfully booked!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow bg-white p-4 ${
        Platform.OS === "ios" ? "pt-12" : "pt-4"
      }`}>
      <Text style={tw`text-2xl font-bold text-center text-gray-800 mb-4`}>
        Confirm Appointment
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

      {/* Appointment Details */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Appointment Details
        </Text>

        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={tw`text-base font-medium text-gray-600`}>Date:</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {selectedDate}
          </Text>
        </View>

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-base font-medium text-gray-600`}>Time:</Text>
          <Text style={tw`text-base font-semibold text-gray-800`}>
            {selectedTime}
          </Text>
        </View>
      </View>

      {/* Selected Services */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Selected Services
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

        <View style={tw`flex-row justify-between items-center mt-4`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>Total:</Text>
          <Text style={tw`text-lg font-bold text-blue-800`}>${totalPrice}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-100 border border-gray-300 rounded-lg py-3 mx-2 items-center`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-base font-semibold text-gray-800`}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-green-500 rounded-lg py-3 mx-2 items-center shadow-lg`}
          onPress={handleConfirm}>
          <Text style={tw`text-base font-semibold text-white`}>
            Confirm Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AppointmentConfirmationScreen;
