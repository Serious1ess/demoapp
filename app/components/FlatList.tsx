import React from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCustomerPress: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  loading,
  searchQuery,
  onSearchChange,
  onCustomerPress,
}) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  // Filter customers based on search query
  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      )
    : customers;

  return (
    <View style={tw`flex-1 p-4`}>
      <TextInput
        style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-6 `}
        placeholder={formatMessage({ id: "Search" })}
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onCustomerPress(item)}>
              <View style={tw`bg-white p-4 rounded-lg mb-4 shadow-md`}>
                <Text style={tw`text-lg font-semibold text-black`}>
                  {item.full_name}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500`}>
              No customers found.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default CustomerList;
