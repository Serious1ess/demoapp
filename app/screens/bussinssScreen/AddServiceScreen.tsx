import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BusinessDaysPicker from "../../components/BusinessDaysPicker";
import CustomPicker from "../../components/CustomPicker";
import ServiceForm from "../../components/servciceListForm"; // Fixed path
import CustomTimePicker from "../../components/timePicker";
import { useUser } from "../../context/UserContext";
import {
  fetchUserServices,
  saveUserServiceData,
} from "../../supabase/busuniss";
import tw from "../../utils/tw";
interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
}

const ServiceScreen = ({ navigation }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    const loadUserServices = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const servicesData = await fetchUserServices(user.id);

        if (servicesData) {
          console.log("firstService", servicesData);
          // Set all form fields
          setServiceType(servicesData.service_type || "");
          setBusinessAddress(servicesData.business_address || "");
          setBusinessDaysOpen(servicesData.business_days_open || []);
          setBusinessHours({
            open: servicesData.business_hours.open || "09:00:00",
            close: servicesData.business_hours.close || "18:00:00",
          });
          setServicesList(servicesData.services_list || []); // Set the services list

          if (servicesData.service_type === "other") {
            setCustomService(servicesData.service_type || "");
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load service data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserServices();
  }, [user?.id]);

  const userId = user.id;
  const [serviceType, setServiceType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDaysOpen, setBusinessDaysOpen] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState({ open: "", close: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customService, setCustomService] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState(""); // Add duration state
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [timeType, setTimeType] = useState("");

  const handleAddService = () => {
    if (!serviceName.trim() || !servicePrice.trim()) {
      setErrors({ ...errors, service: "Please fill all fields" });
      return;
    }

    const newService = {
      id: Date.now().toString(),
      name: serviceName,
      price: servicePrice,
      duration: serviceDuration,
    };

    // Update services list
    setServicesList([...servicesList, newService]);

    setServiceName("");
    setServicePrice("");
    setServiceDuration("30"); // Reset to default
    setErrors({ ...errors, service: "" });
  };

  const toggleDaySelection = (day: string) => {
    setBusinessDaysOpen((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  // Add delete handler function
  const handleDeleteService = (id: string) => {
    setServicesList((prev) => prev.filter((service) => service.id !== id));
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
    // } else if (
    //   !/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(businessHours.open) ||
    //   !/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(businessHours.close)
    // ) {
    //   newErrors.businessHours = "Invalid time format (use HH:MM:SS)";
    // }
    if (servicesList.length === 0)
      newErrors.servicesList = "At least one service is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSaveService = async () => {
    if (!validateForm()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      const result = await saveUserServiceData(userId, {
        serviceType: serviceType === "other" ? customService : serviceType,
        businessAddress,
        businessDaysOpen,
        businessHours,
        servicesList,
      });

      Alert.alert(
        "Success",
        `Service data ${result.isUpdate ? "updated" : "created"} successfully!`
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const hideDatePicker = () => setDatePickerVisible(false);
  const handleDateConfirm = (date: Date) => {
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setBusinessHours({
      ...businessHours,
      [timeType]: time,
    });
    hideDatePicker();
  };

  return (
    <ScrollView style={tw`flex-grow mt-4 border-t border-gray-300 pt-4`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
          Business Information
        </Text>
      </View>

      {/* Service Type */}
      <View style={tw`p-4`}>
        <CustomPicker
          value={serviceType}
          onChange={setServiceType}
          options={[
            { label: "Hair Salon", value: "hair_salon" },
            { label: "Spa", value: "spa" },
            { label: "Barbershop", value: "barbershop" },
            { label: "Nail Salon", value: "nail_salon" },
            { label: "Massage Therapy", value: "massage" },
            { label: "Beauty Salon", value: "beauty_salon" },
            { label: "Other", value: "other" },
          ]}
          placeholder="Select Service Type"
          error={errors.serviceType}
          customInputValue={customService}
          onCustomInputChange={setCustomService}
        />
      </View>

      {/* Service Name and Price Input */}
      <View style={tw`p-4`}>
        <ServiceForm
          serviceName={serviceName}
          setServiceName={setServiceName}
          servicePrice={servicePrice}
          setServicePrice={setServicePrice}
          serviceDuration={serviceDuration} // Pass duration state
          setServiceDuration={setServiceDuration} // Pass duration setter
          errors={errors}
          handleAddService={handleAddService}
          servicesList={servicesList}
          onDeleteService={handleDeleteService}
        />
      </View>

      {/* Business Address */}
      <View style={tw`p-4`}>
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
      </View>

      {/* Business Days Open */}
      <View style={tw`p-4`}>
        <BusinessDaysPicker
          selectedDays={businessDaysOpen}
          onDayToggle={toggleDaySelection}
          error={errors.businessDaysOpen}
          showShortNames={true}
        />
      </View>

      {/* Business Hours */}
      <View style={tw`p-4`}>
        <Text style={tw`text-lg text-gray-900 mb-2`}>Business Hours *</Text>
        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`w-1/2 pr-2`}>
            <Text style={tw`text-sm text-gray-900 mb-1`}>Opening Time:</Text>
            {Platform.OS === "web" ? (
              <CustomTimePicker
                value={businessHours.open}
                onChange={(time) =>
                  setBusinessHours({ ...businessHours, open: time })
                }
              />
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
              <CustomTimePicker
                value={businessHours.close}
                onChange={(time) =>
                  setBusinessHours({ ...businessHours, close: time })
                }
              />
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
      </View>

      {/* DateTime Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      {/* Save Button */}
      <View style={tw`p-4`}>
        <TouchableOpacity
          style={tw`w-full p-4 bg-primary-500 rounded-lg mt-6`}
          onPress={onSaveService}>
          <Text style={tw`text-white text-center text-lg font-bold`}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ServiceScreen;
