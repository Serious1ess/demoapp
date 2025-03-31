import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import CustomerList from "../../components/FlatList";
import { fetchBusinessCustomers } from "../../supabase/customer";
// Define the type for our navigation
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
  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate("ServiceSelection", { customer });
  };
  return (
    <View style={tw`flex-1 p-4`}>
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
