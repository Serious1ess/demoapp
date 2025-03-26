import React from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import tw from "tailwind-react-native-classnames";

interface ServiceItem {
  id: string;
  name: string;
  price: string;
}

interface ServiceFormProps {
  serviceName: string;
  setServiceName: (text: string) => void;
  servicePrice: string;
  setServicePrice: (text: string) => void;
  errors: { service?: string };
  handleAddService: () => void;
  servicesList: ServiceItem[];
  onDeleteService: (id: string) => void; // New prop for delete functionality
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  serviceName,
  setServiceName,
  servicePrice,
  setServicePrice,
  errors,
  handleAddService,
  servicesList,
  onDeleteService,
}) => {
  return (
    <>
      {/* Service Name and Price Input */}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Service Name *</Text>
        <TextInput
          style={tw`w-full p-4 border border-gray-300 rounded-lg`}
          placeholder="Enter service name"
          value={serviceName}
          onChangeText={setServiceName}
        />
      </View>

      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Service Price *</Text>
        <TextInput
          style={tw`w-full p-4 border border-gray-300 rounded-lg`}
          placeholder="Enter service price"
          value={servicePrice}
          onChangeText={(text) => {
            const cleanedText = text.replace(/[^0-9]/g, "");
            setServicePrice(cleanedText);
          }}
          keyboardType="numeric"
        />
      </View>

      {errors.service && (
        <Text style={tw`text-red-500 text-sm mb-2`}>{errors.service}</Text>
      )}

      {/* Add Button */}
      <View style={tw`mt-4`}>
        <Button title="Add Service" onPress={handleAddService} />
      </View>

      {/* Services List */}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Services List</Text>
        <View style={{ height: servicesList.length * 60 }}>
          <FlatList
            data={servicesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={tw`flex-row justify-between items-center p-2 border-b border-gray-200`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700`}>{item.name}</Text>
                  <Text style={tw`text-gray-500 text-sm`}>{item.price} TL</Text>
                </View>
                <TouchableOpacity
                  onPress={() => onDeleteService(item.id)}
                  style={tw`p-2`}>
                  <Icon name="delete" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      </View>
    </>
  );
};

export default ServiceForm;
