import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../utils/tw";
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
  services?: {
    id: string;
    service_type: string;
    services_list: {
      id: string;
      name: string;
      price: string;
      duration: string;
    }[];
    business_days_open: string[];
    business_hours: {
      open: string;
      close: string;
    };
  }[];
}

interface Service {
  id: string;
  name: string;
  price: string;
  selected?: boolean;
}

const ServiceSelectionScreen = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();
  const route = useRoute<ServiceSelectionRouteProp>();
  const { customer, customerServices } = route.params;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  console.log(customerServices?.services_list);
  // Initialize services when component mounts
  useEffect(() => {
    if (customerServices?.services_list) {
      // Transform the services_list into our Service format
      const availableServices = customerServices.services_list.map(
        (service) => ({
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          selected: false, // Initialize all as unselected
        })
      );

      setServices(availableServices);
    }
    setLoading(false);
  }, [customer]);

  const toggleServiceSelection = (serviceId: string) => {
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
      customerServices,
    });
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View
      style={tw`flex-1 bg-white p-4 ${
        Platform.OS === "ios" ? "pt-12" : "pt-4"
      }`}>
      {/* Customer Info */}
      <View
        style={tw`bg-primary-50 p-4 rounded-lg mb-6 border-l-4 border-primary-500 shadow-sm`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
          {customer?.full_name}
        </Text>
        <Text style={tw`text-base text-gray-600`}>
          {formatMessage({ id: "phone" })}: {customer?.phone}
        </Text>
        {customer?.services?.[0]?.service_type && (
          <Text style={tw`text-sm text-gray-500 mt-1`}>
            {formatMessage({ id: "businesstype" })} :{" "}
            {formatMessage({ id: customer.services[0].service_type }) ||
              customer.services[0].service_type}
          </Text>
        )}
      </View>

      {/* Services Section */}
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        {formatMessage({ id: "availableservices" })} :
      </Text>

      {services.length === 0 ? (
        <Text style={tw`text-center text-gray-500 py-8`}>
          {formatMessage({ id: "noservicesavailable" })}
        </Text>
      ) : (
        <ScrollView style={tw`max-h-96 mb-6`}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={tw`flex-row justify-between items-center p-4 mb-3 bg-gray-50 rounded-lg ${
                service.selected
                  ? "bg-primary-50 border-2 border-primary-500"
                  : "border border-gray-200"
              }`}
              onPress={() => toggleServiceSelection(service.id)}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-base font-medium text-gray-800`}>
                  {service.name}
                </Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-base font-medium text-gray-800`}>
                  {service.duration} min
                </Text>
              </View>
              <Text style={tw`text-base font-semibold text-primary-800`}>
                {service.price} TL
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between mt-auto pt-6 pb-4`}>
        <TouchableOpacity
          style={tw`flex-1 bg-primary-500 rounded-lg py-3 mx-2 items-center shadow-lg ${
            services.filter((s) => s.selected).length === 0 ? "opacity-50" : ""
          }`}
          onPress={handleNext}
          disabled={services.filter((s) => s.selected).length === 0}>
          <Text style={tw`text-base font-semibold text-white`}>
            {formatMessage({ id: "next" })}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceSelectionScreen;
