import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
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
type ServiceSelectionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ServiceSelection"
>;

// Define the route prop type for this screen
type ServiceSelectionRouteProp = RouteProp<
  RootStackParamList,
  "ServiceSelection"
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

const ServiceSelectionScreen = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();
  const route = useRoute<ServiceSelectionRouteProp>();
  const { customer } = route.params;

  // Mock services data for demonstration
  const availableServices: Service[] = [
    { id: 1, name: "Haircut", price: 25 },
    { id: 2, name: "Shave", price: 15 },
    { id: 3, name: "Hair Coloring", price: 45 },
    { id: 4, name: "Styling", price: 30 },
    { id: 5, name: "Beard", price: 30 },
    { id: 6, name: "Hair Massage", price: 30 },
  ];
  console.log(customer.services);
  // Get customer's selected services (assuming it's an array of service IDs)
  const customerServiceIds =
    customer?.services?.map((s: Service) => s.id) || [];

  // Initialize services state with customer-selected services marked
  const [services, setServices] = useState<Service[]>(
    availableServices.map((service) => ({
      ...service,
      selected: customerServiceIds.includes(service.id),
    }))
  );

  const toggleServiceSelection = (serviceId: number) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const handleNext = () => {
    const selectedServices = services.filter((s) => s.selected);
    navigation.navigate("DateTimeSelection", {
      customer,
      selectedServices,
    });
  };

  return (
    <View
      style={tw`flex-1 bg-white p-4 ${
        Platform.OS === "ios" ? "pt-12" : "pt-4"
      }`}>
      <Text style={tw`text-2xl font-bold text-center text-gray-800 mb-4`}>
        Select Services
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

      {/* Services Section */}
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        Available Services:
      </Text>
      <ScrollView style={tw`max-h-96 mb-6`}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={tw`flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg ${
              service.selected ? "bg-blue-50 border border-blue-500" : ""
            }`}
            onPress={() => toggleServiceSelection(service.id)}>
            <Text style={tw`text-base text-gray-800`}>{service.name}</Text>
            <Text
              style={tw`text-base font-semibold text-blue-800 flex-1 text-right`}>
              ${service.price}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        <TouchableOpacity
          style={tw`flex-1 bg-gray-100 border border-gray-300 rounded-lg py-3 mx-2 items-center`}
          onPress={() => navigation.goBack()}>
          <Text style={tw`text-base font-semibold text-gray-800`}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-blue-500 rounded-lg py-3 mx-2 items-center shadow-lg`}
          onPress={handleNext}>
          <Text style={tw`text-base font-semibold text-white`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceSelectionScreen;
