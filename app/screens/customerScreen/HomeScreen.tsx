import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { View } from "react-native";
import CustomerList from "../../components/bussnisCustmoersList";
import {
  fetchBusinessCustomers,
  fetchUserServices,
} from "../../supabase/customer";
import tw from "../../utils/tw";
// Define the type for our navigation
type RootStackParamList = {
  Home: undefined;
  ServiceSelection: {
    customer: Customer;
    customerServices?: Service[]; // Add this
  };
  DateTimeSelection: { customer: Customer; selectedServices: Service[] };
  AppointmentConfirmation: {
    customer: Customer;
    selectedServices: Service[];
    selectedDate: string;
    selectedTime: string;
  };
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

// Match the Customer interface exactly as defined in FlatList.tsx
interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

const HomeScreen = () => {
  const intl = useIntl();

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [businessCustomers, setBusinessCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBusinessCustomers = async () => {
      setLoading(true);
      const customers = await fetchBusinessCustomers();
      console.log(customers);
      setBusinessCustomers(customers);
      setLoading(false);
    };
    loadBusinessCustomers();
  }, []);

  // Navigate to ServiceSelection screen instead of showing a modal
  const handleCustomerPress = async (customer: Customer) => {
    try {
      // Fetch the customer's services
      const customerServices = await fetchUserServices(customer.id);
      console.log(customerServices);

      // Navigate with both customer data and their services
      navigation.navigate("ServiceSelection", {
        customer,
        customerServices, // Pass the fetched services
      });
    } catch (error) {
      console.error("Error fetching customer services:", error);
      // Navigate with just customer data if service fetch fails
      navigation.navigate("ServiceSelection", { customer });
    }
  };
  return (
    <View style={tw`flex-1`}>
      <CustomerList
        customers={businessCustomers}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCustomerPress={handleCustomerPress}
      />
    </View>
  );
};

export default HomeScreen;
