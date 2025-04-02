import React from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
interface Service {
  id: string;
  service_type: string;
}

interface Customer {
  id: string;
  full_name: string;
  phone: string;
  profile_picture: string | null;
  services: Service[];
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
          formatMessage({ id: customer.services[0].service_type }) ||
          customer.services[0].service_type.includes(searchQuery)
      )
    : customers;

  return (
    <View style={tw`flex-1 p-4 bg-gray-50`}>
      <TextInput
        style={tw`h-12 border border-gray-300 rounded-lg px-4 mb-6 bg-white`}
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
              <View
                style={tw`bg-white p-4 rounded-lg mb-4 shadow-sm flex-row items-center`}>
                {/* Profile picture with fallback */}
                <View style={tw`mr-4`}>
                  {item.profile_picture ? (
                    <Image
                      source={{ uri: item.profile_picture }}
                      style={tw`w-14 h-14 rounded-full`}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={tw`w-14 h-14 rounded-full bg-gray-300 items-center justify-center`}>
                      <Text style={tw`text-xl text-gray-600`}>
                        {item.full_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Customer details */}
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold text-gray-800`}>
                    {item.full_name}
                  </Text>
                  {/* <Text style={tw`text-sm text-gray-500`}>{item.phone}</Text> */}
                  {item.services?.length > 0 && (
                    <View style={tw`mt-1 flex-row flex-wrap`}>
                      {item.services.map((service, index) => (
                        <View
                          key={`${item.id}-${service.id}`}
                          style={tw`bg-blue-100 rounded-full px-2 py-1 mr-1 mb-1`}>
                          <Text style={tw`text-xs text-blue-800`}>
                            {formatMessage({ id: service.service_type }) ||
                              service.service_type}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={tw`items-center justify-center py-10`}>
              <Text style={tw`text-lg text-gray-500`}>No customers found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CustomerList;
