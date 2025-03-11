import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "../../components/datepicker";
import { styles } from "../../style/customerScreens/dateTimeScreen";

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

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    const selectedDateString = date.toISOString().split("T")[0];
    setSelectedDate(selectedDateString);
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

  // DatePicker placed outside the main container
  if (showDatePicker) {
    return <DatePicker onConfirm={handleDateSelect} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Schedule Appointment</Text>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer?.full_name}</Text>
        <Text style={styles.customerPhone}>Phone: {customer?.phone}</Text>
      </View>

      {/* Selected Services Summary */}
      <View style={styles.servicesSummary}>
        <Text style={styles.sectionTitle}>Selected Services:</Text>
        <ScrollView style={styles.selectedServicesContainer}>
          {selectedServices.map((service) => (
            <View key={service.id} style={styles.selectedServiceItem}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Date Selection */}
      <Text style={styles.dateSelectorTitle}>Choose Your Preferred Date:</Text>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>Open Calendar</Text>
        </TouchableOpacity>

        {selectedDate && (
          <Text style={styles.selectedDate}>Date: {selectedDate}</Text>
        )}
      </View>

      {/* Time Slots */}
      {selectedDate && availableHours.length > 0 && (
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotTitle}>Select a Time Slot</Text>
          <View style={styles.timeSlotGrid}>
            {availableHours.map((item) => (
              <TouchableOpacity
                key={item.time}
                style={[
                  styles.timeSlot,
                  item.isBusy ? styles.busySlot : styles.availableSlot,
                  selectedTime === item.time && styles.selectedSlot,
                ]}
                disabled={item.isBusy}
                onPress={() => setSelectedTime(item.time)}>
                <Text
                  style={[
                    styles.timeSlotText,
                    { color: item.isBusy ? "#888" : "#000" },
                  ]}>
                  {item.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTime && (
            <Text style={styles.selectedTimeText}>
              Selected Time: {selectedTime}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
          disabled={!selectedTime}>
          <Text
            style={[
              styles.buttonText,
              { color: selectedTime ? "#fff" : "#aaa" },
            ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateTimeSelectionScreen;
