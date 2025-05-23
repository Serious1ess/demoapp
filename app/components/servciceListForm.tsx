import React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import tw from "../utils/tw";
interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string; // Added duration field
}

interface ServiceFormProps {
  serviceName: string;
  setServiceName: (text: string) => void;
  servicePrice: string;
  setServicePrice: (text: string) => void;
  serviceDuration: string; // New prop for duration
  setServiceDuration: (text: string) => void; // New prop for duration setter
  errors: { service?: string };
  handleAddService: () => void;
  servicesList: ServiceItem[];
  onDeleteService: (id: string) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  serviceName,
  setServiceName,
  servicePrice,
  setServicePrice,
  serviceDuration,
  setServiceDuration,
  errors,
  handleAddService,
  servicesList,
  onDeleteService,
}) => {
  return (
    <>
      {/* Service Name Input */}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Service Name *</Text>
        <TextInput
          style={tw`w-full p-4 border border-gray-300 rounded-lg`}
          placeholder="Enter service name"
          value={serviceName}
          onChangeText={setServiceName}
        />
      </View>

      {/* Service Price Input */}
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

      {/* Service Duration Input */}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Duration (minutes) *</Text>
        <TextInput
          style={tw`w-full p-4 border border-gray-300 rounded-lg`}
          placeholder="Enter duration in minutes"
          value={serviceDuration}
          onChangeText={(text) => {
            const cleanedText = text.replace(/[^0-9]/g, "");
            setServiceDuration(cleanedText);
          }}
          keyboardType="numeric"
        />
      </View>

      {errors.service && (
        <Text style={tw`text-red-500 text-sm mb-2`}>{errors.service}</Text>
      )}

      {/* Add Button */}
      <View style={tw`mt-4`}>
        <TouchableOpacity
          style={tw`bg-primary py-2 rounded`}
          onPress={handleAddService}>
          <Text style={tw`text-white text-center text-lg`}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Services List</Text>
        <View style={{ height: servicesList.length * 80 }}>
          <FlatList
            data={servicesList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={tw`flex-row justify-between items-center p-3 border-b border-gray-200`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-700 font-medium`}>{item.name}</Text>
                  <View style={tw`flex-row justify-between mt-1`}>
                    <Text style={tw`text-gray-500 text-sm`}>
                      {item.price} TL
                    </Text>
                    <Text style={tw`text-gray-500 text-sm`}>
                      {item.duration} mins
                    </Text>
                  </View>
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
