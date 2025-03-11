import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../style/customerScreens/appointmentConformationScreen";
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
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Confirm Appointment</Text>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer?.full_name}</Text>
        <Text style={styles.customerPhone}>Phone: {customer?.phone}</Text>
      </View>

      {/* Appointment Details */}
      <View style={styles.appointmentDetails}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{selectedDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{selectedTime}</Text>
        </View>
      </View>

      {/* Selected Services */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Selected Services</Text>

        <ScrollView style={styles.servicesContainer}>
          {selectedServices.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            Confirm Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentConfirmationScreen;
