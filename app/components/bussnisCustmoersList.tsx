import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "../utils/tw"; // Using your custom tw utility

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

// Map of service types to icons and colors
const SERVICE_ICONS: Record<
  string,
  {
    icon: string;
    iconFamily: "MaterialIcons" | "MaterialCommunityIcons" | "FontAwesome";
    color: string;
    bgColor: string;
  }
> = {
  hair_salon: {
    icon: "content-cut",
    iconFamily: "MaterialIcons",
    color: "#9C5221", // brown
    bgColor: "#FDF2E9",
  },
  barbershop: {
    icon: "content-cut",
    iconFamily: "MaterialIcons",
    color: "#9C5221", // brown
    bgColor: "#FDF2E9",
  },
  nail_salon: {
    icon: "brush",
    iconFamily: "MaterialIcons",
    color: "#8E44AD", // purple
    bgColor: "#F5EEF8",
  },
  styling: {
    icon: "auto-fix",
    iconFamily: "MaterialCommunityIcons",
    color: "#3498DB", // blue
    bgColor: "#EBF5FB",
  },
  spa: {
    icon: "face",
    iconFamily: "MaterialIcons",
    color: "#27AE60", // green
    bgColor: "#E9F7EF",
  },
  consultation: {
    icon: "calendar",
    iconFamily: "FontAwesome",
    color: "#D35400", // orange
    bgColor: "#FDF2E9",
  },
  // Default icon/color for any other service type
  default: {
    icon: "star",
    iconFamily: "MaterialIcons",
    color: "#4b8494", // primary color
    bgColor: "#E8F4F8",
  },
};

const RenderIcon = ({ iconData, size = 16, selected = false }) => {
  const color = selected ? "#ffffff" : iconData.color;

  switch (iconData.iconFamily) {
    case "MaterialIcons":
      return <MaterialIcons name={iconData.icon} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return (
        <MaterialCommunityIcons
          name={iconData.icon}
          size={size}
          color={color}
        />
      );
    case "FontAwesome":
      return <FontAwesome name={iconData.icon} size={size} color={color} />;
    default:
      return <MaterialIcons name="star" size={size} color={color} />;
  }
};

const CategoryButton = ({ category, isSelected, onPress, label }) => {
  const iconData = SERVICE_ICONS[category] || SERVICE_ICONS.default;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`flex-row items-center px-3 py-2 rounded-full mr-2 mb-1 ${
        isSelected ? "bg-primary" : ""
      }`}
      style={[
        tw`flex-row items-center px-3 py-2 rounded-full mr-2 mb-1`,
        isSelected ? tw`bg-primary` : { backgroundColor: iconData.bgColor },
      ]}>
      <View style={tw`mr-1.5 opacity-90`}>
        <RenderIcon iconData={iconData} selected={isSelected} />
      </View>
      <Text
        style={[
          tw`font-medium text-sm`,
          isSelected ? tw`text-white` : { color: iconData.color },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  loading,
  searchQuery,
  onSearchChange,
  onCustomerPress,
}) => {
  const intl = useIntl();
  const formatMessage = intl.formatMessage;

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from all customers
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const uniqueCategories = new Set<string>();
    customers.forEach((customer) => {
      customer.services?.forEach((service) => {
        uniqueCategories.add(service.service_type);
      });
    });
    setCategories(Array.from(uniqueCategories));
  }, [customers]);

  // Filter customers based on search query and selected category
  const filteredCustomers = customers.filter((customer) => {
    // Apply text search filter
    const matchesSearch = !searchQuery
      ? true
      : customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.services?.some((service) => {
          const serviceTypeDisplay =
            formatMessage({ id: service.service_type }) || service.service_type;
          return serviceTypeDisplay
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });

    // Apply category filter
    const matchesCategory = !selectedCategory
      ? true
      : customer.services?.some(
          (service) => service.service_type === selectedCategory
        );

    // Customer must match both filters
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={tw`flex-1 p-4 bg-gray-50`}>
      {/* Search Bar with Icon */}
      <View
        style={tw`flex-row items-center bg-white rounded-lg px-3 h-12 border border-gray-200 mb-4`}>
        <MaterialIcons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={tw`flex-1 ml-2 text-gray-800`}
          placeholder={formatMessage({ id: "Search customers or services" })}
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Category filter section */}
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <MaterialIcons name="filter-list" size={16} color="#4B5563" />
          <Text style={tw`ml-1.5 text-sm font-medium text-gray-600`}>
            Filter by service
          </Text>
        </View>

        {/* Category buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-1`}>
          {/* "All" button */}
          <CategoryButton
            category="all"
            isSelected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
            label="All"
          />

          {/* Service category buttons */}
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isSelected={category === selectedCategory}
              onPress={() =>
                setSelectedCategory(
                  category === selectedCategory ? null : category
                )
              }
              label={formatMessage({ id: category }) || category}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={tw`flex-row justify-between mb-2`}>
        <Text style={tw`text-sm text-gray-500`}>
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "customer" : "customers"} found
        </Text>
      </View>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#4b8494" />
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onCustomerPress(item)}>
              <View
                style={tw`bg-white p-4 rounded-lg mb-3 flex-row items-center`}>
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
                      style={tw`w-14 h-14 rounded-full bg-gray-200 items-center justify-center`}>
                      <Text style={tw`text-xl text-gray-600 font-medium`}>
                        {item.full_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Customer details */}
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold text-gray-800`}>
                    {item.full_name}
                  </Text>
                  {item.services?.length > 0 && (
                    <View style={tw`mt-1 flex-row flex-wrap`}>
                      {item.services.map((service) => {
                        const iconData =
                          SERVICE_ICONS[service.service_type] ||
                          SERVICE_ICONS.default;
                        return (
                          <View
                            key={`${item.id}-${service.id}`}
                            style={[
                              tw`rounded-full px-2 py-1 mr-1 mb-1 flex-row items-center`,
                              { backgroundColor: iconData.bgColor },
                            ]}>
                            <View style={tw`mr-1`}>
                              <RenderIcon iconData={iconData} size={12} />
                            </View>
                            <Text
                              style={[
                                tw`text-xs font-medium`,
                                { color: iconData.color },
                              ]}>
                              {formatMessage({ id: service?.service_type }) ||
                                service.service_type}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View
              style={tw`items-center justify-center py-10 bg-white rounded-lg p-5`}>
              <MaterialIcons name="people" size={40} color="#9CA3AF" />
              <Text style={tw`text-base text-gray-500 mt-3`}>
                No customers found
              </Text>
              <Text style={tw`text-sm text-gray-400 mt-1 text-center`}>
                Try changing your search or filter criteria
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CustomerList;
