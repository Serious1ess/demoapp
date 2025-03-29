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
import tw from "tailwind-react-native-classnames";
import CustomPicker from "../../components/CustomPicker"; // Import your CustomPicker component
import TurkishIdentityValidation from "../../context/turkishIdcheck";
import { handleSignup } from "../../supabase/auth";

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  phone?: string;
  idNumber?: string;
  profilePicture?: string;
  birthday?: string;
  country?: string;
  [key: string]: string | undefined;
}

type SignupScreenNavigationProp = StackNavigationProp<any, "Signup">;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [isBusiness, setIsBusiness] = useState(false);

  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Country options - only Turkey for now
  const countryOptions = [{ label: "Turkey", value: "turkey" }];
  const [country, setCountry] = useState("turkey");

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

  const pickImage = async () => {
    if (Platform.OS === "web") {
      // Web implementation
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 20 * 1024 * 1024) {
            Alert.alert("Error", "Image must be less than 20MB");
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            setProfilePicture(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Mobile implementation
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePicture(result.assets[0].uri);
      }
    }
  };

  const validateForm = async () => {
    let isValid = true;
    let newErrors: FormErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!name) newErrors.name = "Name is required";
    if (!surname) newErrors.surname = "Surname is required";
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+|00)[0-9]{3,}$/.test(phone)) {
      newErrors.phone =
        "Phone must start with + or 00 followed by country code";
    }

    // Turkish ID validation
    // if (idNumber) {
    //   // First check the algorithm
    //   if (!turkishIdValidator.idValidation(idNumber)) {
    //     newErrors.idNumber = "Invalid Turkish ID number";
    //   } else {
    //     // Then perform the mock online validation
    //     try {
    //       const isValidId = await turkishIdValidator.identityValidation({
    //         identity: idNumber,
    //         name: name,
    //         surname: surname,
    //         year: parseInt(birthday),
    //       });

    //       if (!isValidId) {
    //         newErrors.idNumber = "ID verification failed";
    //       }
    //     } catch (error) {
    //       newErrors.idNumber = "ID verification error";
    //       console.error("ID validation error:", error);
    //     }
    //   }
    // }

    // Calculate minimum birth year (18 years ago from current year)
    const currentYear = new Date().getFullYear();
    const minBirthYear = currentYear - 18;
    if (!birthday) {
      newErrors.birthday = "Year of birth is required";
    } else if (birthday.length !== 4) {
      newErrors.birthday = "Please enter a valid 4-digit year";
    } else if (!/^(19|20)\d{2}$/.test(birthday)) {
      newErrors.birthday = "Year must start with 19 or 20";
    } else if (parseInt(birthday) > minBirthYear) {
      newErrors.birthday = "You must be at least 18 years old";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignup = async () => {
    if (!(await validateForm())) {
      Alert.alert("Validation Error", "Please check your information");
      return;
    }

    setLoading(true);
    try {
      await handleSignup(
        email,
        password,
        name, // First name
        surname, // Last name
        phone,
        idNumber,
        profilePicture,
        birthday, // Birth year
        setWaitingForVerification,
        isBusiness,
        navigation
      );
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatYearOnly = (date: Date | null) => {
    if (!date) return "";
    return date.getFullYear().toString();
  };
  const turkishIdValidator = new TurkishIdentityValidation();
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
      style={tw`flex-1 bg-gray-100`}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView
        contentContainerStyle={tw`py-5 px-5 min-h-full`}
        keyboardShouldPersistTaps="handled">
        <View style={tw`max-w-md w-full mx-auto`}>
          <View style={tw`mb-8`}>
            <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>
              Create Your Account
            </Text>
            <Text style={tw`text-lg text-gray-600`}>
              Join us to get started
            </Text>
          </View>

          {/* Name */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.name ? "border-red-500" : ""
              }`}
              autoCapitalize="words"
            />
            {errors.name && (
              <Text style={tw`text-red-500 text-sm mt-1`}>{errors.name}</Text>
            )}
          </View>

          {/* Surname */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Surname"
              value={surname}
              onChangeText={setSurname}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.surname ? "border-red-500" : ""
              }`}
              autoCapitalize="words"
            />
            {errors.surname && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {errors.surname}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={tw`text-red-500 text-sm mt-1`}>{errors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Phone Number (e.g., +905551234567 or 00905551234567)"
              value={phone}
              onChangeText={(text) => {
                // Allow only numbers, +, and 00 prefix
                const formatted = text
                  .replace(/[^0-9+]/g, "") // Remove all non-numeric and non-plus characters
                  .replace(/(?!^\+)^\+/g, "") // Allow only one + at start
                  .replace(/^00/, "00") // Keep 00 prefix
                  .replace(/^([^0+]).*/, "$1") // Don't allow first character other than 0 or +
                  .replace(/^0([^0]).*/, "0$1") // If starts with 0, next must be 0 (for 00)
                  .replace(/^\+([^0-9]).*/, "+"); // After +, must be number

                setPhone(formatted);
              }}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.phone ? "border-red-500" : ""
              }`}
              keyboardType="phone-pad"
              maxLength={15} // Reasonable max length for international numbers
            />
            {errors.phone && (
              <Text style={tw`text-red-500 text-sm mt-1`}>{errors.phone}</Text>
            )}
          </View>

          {/* ID Number */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Turkish ID Number"
              value={idNumber}
              onChangeText={(text) => {
                // Only allow numbers
                const numbersOnly = text.replace(/[^0-9]/g, "");
                setIdNumber(numbersOnly);
              }}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.idNumber ? "border-red-500" : ""
              }`}
              keyboardType="numeric"
              maxLength={11}
            />
            {errors.idNumber && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {errors.idNumber}
              </Text>
            )}
          </View>

          {/* Birthday (Year Only) */}
          <View style={tw`mb-4`}>
            <TextInput
              placeholder="Enter year of birth (YYYY)"
              value={birthday}
              style={tw`w-full p-4 border border-gray-300 rounded-lg ${
                errors.birthday ? "border-red-500" : ""
              }`}
              maxLength={4}
              onChangeText={(input) => {
                // Only allow numbers
                const numbersOnly = input.replace(/[^0-9]/g, "");

                // Validate it starts with 19 or 20 (for years 1900-2099)
                let validated = numbersOnly;
                if (
                  numbersOnly.length >= 1 &&
                  !["1", "2"].includes(numbersOnly[0])
                ) {
                  validated = "";
                }
                if (
                  numbersOnly.length >= 2 &&
                  numbersOnly[0] === "1" &&
                  numbersOnly[1] !== "9"
                ) {
                  validated = numbersOnly.slice(0, 1);
                }
                if (
                  numbersOnly.length >= 2 &&
                  numbersOnly[0] === "2" &&
                  numbersOnly[1] !== "0"
                ) {
                  validated = numbersOnly.slice(0, 1);
                }

                setBirthday(validated);
              }}
              keyboardType="numeric"
            />
            {errors.birthday && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {errors.birthday}
              </Text>
            )}
          </View>
          {/* Country Picker (Turkey only) */}
          <CustomPicker
            value={country}
            options={countryOptions}
            onChange={setCountry}
            placeholder="Select Country"
            error={errors.country}
          />

          {/* Profile Picture */}
          <View style={tw`mb-6`}>
            <TouchableOpacity
              style={tw`w-full h-40 border border-gray-300 rounded-lg justify-center items-center overflow-hidden bg-gray-200`}
              onPress={pickImage}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              ) : (
                <Text style={tw`text-gray-600`}>Select Profile Picture</Text>
              )}
            </TouchableOpacity>
            {errors.profilePicture && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {errors.profilePicture}
              </Text>
            )}
          </View>
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
          {/* Sign Up Button */}
          <TouchableOpacity
            style={tw`w-full p-4 bg-blue-500 rounded-lg mb-4`}
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
            onPress={() => navigation.navigate("VerifyEmail", { email })}
            style={tw`mb-4`}>
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
