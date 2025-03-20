import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import tw from "tailwind-react-native-classnames";
import { handleSignup } from "../../supabase/auth"; // Import handleSignup

// Define types for our form errors
interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  idNumber?: string;
  profilePicture?: string;
  serviceType?: string;
  businessAddress?: string;
  businessDaysOpen?: string;
  businessHours?: string;
  [key: string]: string | undefined;
}

// Define type for business info
interface BusinessInfo {
  serviceType: string;
  businessAddress: string;
  businessDaysOpen: string[];
  businessHours: { open: string; close: string };
}

// Navigation prop type
type SignupScreenNavigationProp = StackNavigationProp<any, "Signup">;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState(""); // State for ID number
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State for profile picture
  const [isBusiness, setIsBusiness] = useState(false); // Toggle for business account
  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);

  // Business-specific states
  const [serviceType, setServiceType] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDaysOpen, setBusinessDaysOpen] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState({ open: "", close: "" });
  const [errors, setErrors] = useState<FormErrors>({}); // For validation errors

  // Request permission for camera/gallery when component mounts
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload photos!"
        );
      }
    })();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // Days of the week options
  const daysOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  // Toggle selection of business days
  const toggleDaySelection = (day: string) => {
    if (businessDaysOpen.includes(day)) {
      setBusinessDaysOpen(businessDaysOpen.filter((d) => d !== day));
    } else {
      setBusinessDaysOpen([...businessDaysOpen, day]);
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    let newErrors: FormErrors = {};

    // Common validations
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!idNumber) newErrors.idNumber = "ID number is required";
    if (!profilePicture)
      newErrors.profilePicture = "Profile picture is required";

    // Business-specific validations
    if (isBusiness) {
      if (!serviceType) newErrors.serviceType = "Service type is required";
      if (!businessAddress)
        newErrors.businessAddress = "Business address is required";
      if (businessDaysOpen.length === 0)
        newErrors.businessDaysOpen = "Business days are required";
      if (!businessHours.open || !businessHours.close)
        newErrors.businessHours = "Business hours are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignup = async () => {
    if (!validateForm()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Prepare business info object if user is a business
      const businessData = isBusiness
        ? {
            serviceType,
            businessAddress,
            businessDaysOpen,
            businessHours,
          }
        : null;

      // Pass all the required parameters to handleSignup
      await handleSignup(
        email,
        password,
        fullName,
        phone,
        idNumber,
        profilePicture,
        isBusiness,
        businessData,
        setWaitingForVerification,
        navigation
      );
    } catch (error) {
      Alert.alert("Error", "Failed to sign up. Please try again.");
      console.error("Signup error:", error);
    }
    setLoading(false);
  };

  if (waitingForVerification) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-lg text-gray-800 mb-4`}>
          Please verify your email to continue.
        </Text>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-gray-100`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center items-center p-5`}>
        <View style={tw`w-full max-w-md`}>
          <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>
            Create Your Account
          </Text>
          <Text style={tw`text-lg text-gray-600 mb-8`}>
            Join us to get started
          </Text>

          {/* Full Name Input */}
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
              errors.fullName ? "border-red-500" : ""
            }`}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />
          {errors.fullName && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.fullName}</Text>
          )}

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
              errors.email ? "border-red-500" : ""
            }`}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          {errors.email && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.email}</Text>
          )}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
              errors.password ? "border-red-500" : ""
            }`}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          {errors.password && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.password}</Text>
          )}

          {/* Phone Number Input */}
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
              errors.phone ? "border-red-500" : ""
            }`}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          {errors.phone && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.phone}</Text>
          )}

          {/* ID Number Input */}
          <TextInput
            placeholder="ID Number"
            value={idNumber}
            onChangeText={setIdNumber}
            style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 ${
              errors.idNumber ? "border-red-500" : ""
            }`}
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          {errors.idNumber && (
            <Text style={tw`text-red-500 text-sm mb-2`}>{errors.idNumber}</Text>
          )}

          {/* Profile Picture Selection */}
          <TouchableOpacity
            style={tw`w-full h-40 border border-gray-300 rounded-lg mb-4 justify-center items-center overflow-hidden`}
            onPress={pickImage}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={tw`w-full h-full`}
              />
            ) : (
              <View
                style={tw`w-full h-full justify-center items-center bg-gray-200`}>
                <Text style={tw`text-gray-600`}>Select Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.profilePicture && (
            <Text style={tw`text-red-500 text-sm mb-2`}>
              {errors.profilePicture}
            </Text>
          )}

          {/* Business Account Toggle */}
          <View style={tw`flex-row justify-between items-center w-full mb-4`}>
            <Text style={tw`text-lg text-gray-900`}>Business Account</Text>
            <Switch
              value={isBusiness}
              onValueChange={setIsBusiness}
              trackColor={{ false: "#ccc", true: "#007bff" }}
              thumbColor={isBusiness ? "#fff" : "#f4f3f4"}
            />
          </View>

          {/* Conditional Business Account Fields */}
          {isBusiness && (
            <View style={tw`w-full mt-4 border-t border-gray-300 pt-4`}>
              <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
                Business Information
              </Text>

              {/* Service Type */}
              <View style={tw`w-full mb-4`}>
                <Text style={tw`text-lg text-gray-900 mb-2`}>
                  Service Type *
                </Text>
                <RNPickerSelect
                  onValueChange={(value) => setServiceType(value)}
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
                    inputIOS: tw`w-full p-4 border border-gray-300 rounded-lg`,
                    inputAndroid: tw`w-full p-4 border border-gray-300 rounded-lg`,
                  }}
                  value={serviceType}
                />
              </View>
              {errors.serviceType && (
                <Text style={tw`text-red-500 text-sm mb-2`}>
                  {errors.serviceType}
                </Text>
              )}

              {/* Business Address (Mock Map Selection) */}
              <Text style={tw`text-lg text-gray-900 mb-2`}>
                Business Address *
              </Text>
              <TextInput
                placeholder="Select Address (Map)"
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
              <Text style={tw`text-lg text-gray-900 mb-2`}>
                Business Days Open *
              </Text>
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
              <Text style={tw`text-lg text-gray-900 mb-2`}>
                Business Hours *
              </Text>
              <View style={tw`flex-row justify-between mb-4`}>
                <View style={tw`w-1/2 pr-2`}>
                  <Text style={tw`text-sm text-gray-900 mb-1`}>
                    Opening Time:
                  </Text>
                  <TextInput
                    placeholder="09:00"
                    value={businessHours.open}
                    onChangeText={(text) =>
                      setBusinessHours({ ...businessHours, open: text })
                    }
                    style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                      errors.businessHours ? "border-red-500" : ""
                    }`}
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={tw`w-1/2 pl-2`}>
                  <Text style={tw`text-sm text-gray-900 mb-1`}>
                    Closing Time:
                  </Text>
                  <TextInput
                    placeholder="17:00"
                    value={businessHours.close}
                    onChangeText={(text) =>
                      setBusinessHours({ ...businessHours, close: text })
                    }
                    style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                      errors.businessHours ? "border-red-500" : ""
                    }`}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              {errors.businessHours && (
                <Text style={tw`text-red-500 text-sm mb-2`}>
                  {errors.businessHours}
                </Text>
              )}
            </View>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={tw`w-full p-4 bg-blue-500 rounded-lg mt-6`}
            onPress={onSignup}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={tw`text-white text-center text-lg font-bold`}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={tw`mt-4`}>
            <Text style={tw`text-gray-600 text-center`}>
              Already have an account?{" "}
              <Text style={tw`text-blue-500 font-bold`}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
