import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../style/customerScreens/servicesScreen";

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
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Haircut", price: 25, selected: false },
    { id: 2, name: "Shave", price: 15, selected: false },
    { id: 3, name: "Hair Coloring", price: 45, selected: false },
    { id: 4, name: "Styling", price: 30, selected: false },
  ]);

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
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Select Services</Text>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer?.full_name}</Text>
        <Text style={styles.customerPhone}>Phone: {customer?.phone}</Text>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Available Services:</Text>
      <ScrollView style={styles.servicesContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceItem,
              service.selected && styles.selectedServiceItem,
            ]}
            onPress={() => toggleServiceSelection(service.id)}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceSelectionScreen;
