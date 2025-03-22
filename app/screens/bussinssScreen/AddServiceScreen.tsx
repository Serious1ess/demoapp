import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import tw from "tailwind-react-native-classnames";
import { useUser } from "../../context/UserContext";
import { saveUserServiceData } from "../../supabase/auth.js";

const ServiceScreen = ({ navigation }) => {
  const { user } = useUser();

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const userId = user.id;
  const [serviceType, setServiceType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDaysOpen, setBusinessDaysOpen] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState({ open: "", close: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customService, setCustomService] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [servicesList, setServicesList] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [timeType, setTimeType] = useState("");
  const [TimeValue, setTimeValue] = useState(dayjs("2022-04-17T15:30"));
  const daysOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  const toggleDaySelection = (day: string) => {
    setBusinessDaysOpen((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddService = () => {
    if (!serviceName.trim() || !servicePrice.trim()) {
      setErrors({ ...errors, service: "Service name and price are required" });
      return;
    }

    const newService = {
      id: Math.random().toString(),
      name: serviceName,
      price: servicePrice,
    };

    setServicesList([...servicesList, newService]);
    setServiceName("");
    setServicePrice("");
    setErrors({ ...errors, service: "" });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!serviceType) newErrors.serviceType = "Service type is required";
    if (!businessAddress)
      newErrors.businessAddress = "Business address is required";
    if (businessDaysOpen.length === 0)
      newErrors.businessDaysOpen = "Business days are required";
    if (!businessHours.open || !businessHours.close)
      newErrors.businessHours = "Business hours are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSaveService = async () => {
    if (!validateForm()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    const finalServiceType =
      serviceType === "other" ? customService : serviceType;

    const businessData = {
      serviceType: finalServiceType,
      businessAddress,
      businessDaysOpen,
      businessHours,
    };

    console.log("Business Data:", businessData);

    try {
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in.");
        return;
      }

      await saveUserServiceData(userId, businessData);
      Alert.alert("Success", "Saved successfully.");
      navigation.navigate("Profile");
    } catch (error) {
      Alert.alert("Error", "Failed to save service data.");
    }
  };

  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date: Date) => {
    if (timeType === "open") {
      setBusinessHours({ ...businessHours, open: date.toLocaleTimeString() });
    } else {
      setBusinessHours({ ...businessHours, close: date.toLocaleTimeString() });
    }
    hideDatePicker();
  };

  return (
    <View style={tw`w-full mt-4 border-t border-gray-300 pt-4`}>
      <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
        Business Information
      </Text>

      {/* Service Type */}
      <View style={tw`w-full mb-4 z-10`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Service Type *</Text>
        <View style={tw`border border-gray-300 rounded-lg`}>
          <RNPickerSelect
            onValueChange={(value) => {
              setServiceType(value);
              if (value !== "other") setCustomService("");
            }}
            items={[
              { label: "Hair Salon", value: "hair_salon" },
              { label: "Spa", value: "spa" },
              { label: "Barbershop", value: "barbershop" },
              { label: "Nail Salon", value: "nail_salon" },
              { label: "Massage Therapy", value: "massage" },
              { label: "Beauty Salon", value: "beauty_salon" },
              { label: "Other", value: "other" },
            ]}
            placeholder={{ label: "Select Service Type", value: null }}
            style={{
              inputIOS: tw`w-full p-4 border-gray-300`,
              inputAndroid: tw`w-full p-4 border-gray-300`,
            }}
            value={serviceType}
          />
        </View>

        {serviceType === "other" && (
          <View style={tw`mt-2`}>
            <TextInput
              style={tw`w-full p-4 border border-gray-300 rounded-lg`}
              placeholder="Enter your service type"
              value={customService}
              onChangeText={setCustomService}
            />
          </View>
        )}

        {errors.serviceType && (
          <Text style={tw`text-red-500 text-sm mb-2`}>
            {errors.serviceType}
          </Text>
        )}
      </View>

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
          onChangeText={setServicePrice}
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
        <FlatList
          data={servicesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row justify-between p-2 border-b border-gray-200`}>
              <Text style={tw`text-gray-700`}>{item.name}</Text>
              <Text style={tw`text-gray-700`}>${item.price}</Text>
            </View>
          )}
        />
      </View>

      {/* Business Address */}
      <Text style={tw`text-lg text-gray-900 mb-2`}>Business Address *</Text>
      <TextInput
        placeholder="Enter Address"
        value={businessAddress}
        onChangeText={setBusinessAddress}
        style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
          errors.businessAddress ? "border-red-500" : ""
        }`}
        placeholderTextColor="#999"
      />
      {errors.businessAddress && (
        <Text style={tw`text-red-500 text-sm mb-2`}>
          {errors.businessAddress}
        </Text>
      )}

      {/* Business Days Open */}
      <Text style={tw`text-lg text-gray-900 mb-2`}>Business Days Open *</Text>
      <View style={tw`flex-row flex-wrap justify-between mb-4`}>
        {daysOptions.map((day) => (
          <TouchableOpacity
            key={day.value}
            style={tw`p-3 border border-gray-300 rounded-full mb-2 ${
              businessDaysOpen.includes(day.value)
                ? "bg-blue-500 border-blue-500"
                : ""
            }`}
            onPress={() => toggleDaySelection(day.value)}>
            <Text
              style={tw`text-gray-900 ${
                businessDaysOpen.includes(day.value) ? "text-white" : ""
              }`}>
              {day.label.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.businessDaysOpen && (
        <Text style={tw`text-red-500 text-sm mb-2`}>
          {errors.businessDaysOpen}
        </Text>
      )}

      {/* Business Hours */}
      <Text style={tw`text-lg text-gray-900 mb-2`}>Business Hours *</Text>
      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`w-1/2 pr-2`}>
          <Text style={tw`text-sm text-gray-900 mb-1`}>Opening Time:</Text>
          {Platform.OS === "web" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Mobile variant"
                value={TimeValue}
                onChange={(newValue) => {
                  const time = new Date(newValue).toLocaleTimeString();
                  setBusinessHours({ ...businessHours, open: time });
                }}
              />
            </LocalizationProvider>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setTimeType("open");
                setDatePickerVisible(true);
              }}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.businessHours ? "border-red-500" : ""
              }`}>
              <Text style={tw`text-gray-900`}>
                {businessHours.open || "09:00"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={tw`w-1/2 pl-2`}>
          <Text style={tw`text-sm text-gray-900 mb-1`}>Closing Time:</Text>
          {Platform.OS === "web" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Mobile variant"
                value={TimeValue}
                onChange={(newValue) => {
                  const time = new Date(newValue).toLocaleTimeString();
                  setBusinessHours({ ...businessHours, close: time });
                }}
              />
            </LocalizationProvider>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setTimeType("close");
                setDatePickerVisible(true);
              }}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.businessHours ? "border-red-500" : ""
              }`}>
              <Text style={tw`text-gray-900`}>
                {businessHours.close || "17:00"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {errors.businessHours && (
        <Text style={tw`text-red-500 text-sm mb-2`}>
          {errors.businessHours}
        </Text>
      )}

      {/* DateTime Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={tw`w-full p-4 bg-blue-500 rounded-lg mt-6`}
        onPress={onSaveService}>
        <Text style={tw`text-white text-center text-lg font-bold`}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceScreen;
