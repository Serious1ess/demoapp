import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomPicker from "../../components/CustomPicker";
import TurkishIdentityValidation from "../../context/turkishIdcheck";
import { handleSignup } from "../../supabase/auth";
import tw from "../../utils/tw"; // Using your custom tw utility

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
  const intl = useIntl();
  const scrollViewRef = useRef<ScrollView>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [birthday, setBirthday] = useState<string>("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const windowHeight = Dimensions.get("window").height;

  // Country options - only Turkey for now
  const countryOptions = [{ label: "Turkey", value: "turkey" }];
  const [country, setCountry] = useState("turkey");

  // Platform-specific styling for form scrolling area
  const formScrollStyle =
    Platform.OS === "web"
      ? {
          ...tw`py-4 px-5`,
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto",
        }
      : tw`py-4 px-5`;

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
    try {
      if (Platform.OS === "web") {
        // Web implementation (unchanged)
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            if (file.size > 20 * 1024 * 1024) {
              Alert.alert("Error", "Image must be less than 20MB");
              return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
              setProfilePicture(event.target?.result as string);
              setProfileImageChanged(true);
              setErrors((prev) => ({ ...prev, profilePicture: undefined }));
            };
            reader.onerror = () => {
              Alert.alert("Error", "Failed to read the selected image");
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else {
        // Mobile implementation - working with current Expo versions
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images", "videos"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
          const uri = result.assets[0].uri;
          setProfilePicture(uri.startsWith("file://") ? uri : `file://${uri}`);
          setProfileImageChanged(true);
          setErrors((prev) => ({ ...prev, profilePicture: undefined }));
        }
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert(
        "Image Selection Error",
        "There was a problem selecting your image. Please try again."
      );
    }
  };

  const validateForm = async () => {
    let isValid = true;
    let newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!name) newErrors.name = "Name is required";
    if (!surname) newErrors.surname = "Surname is required";

    // Phone validation
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
      // Find the first field with an error and scroll to it
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0 && scrollViewRef.current) {
        // This is a simple implementation - ideally you'd scroll to the specific field
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      return;
    }

    setLoading(true);
    try {
      await handleSignup(
        email,
        password,
        name,
        surname,
        phone,
        idNumber,
        profilePicture,
        birthday,
        setWaitingForVerification,
        isBusiness,
        navigation
      );
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        "An error occurred during signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    placeholder: string,
    value: string,
    setValue: (text: string) => void,
    error?: string,
    keyboardType: any = "default",
    secureTextEntry: boolean = false,
    maxLength?: number,
    icon?: string,
    rightIcon?: JSX.Element
  ) => {
    return (
      <View style={tw`mb-4`}>
        <View
          style={[
            tw`flex-row items-center border rounded-xl overflow-hidden`,
            {
              borderColor: error ? "#ef476f" : "#e9ecef",
              backgroundColor: "#ffffff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              elevation: 1,
            },
          ]}>
          {icon && (
            <View style={tw`pl-4 pr-2`}>
              <Ionicons
                name={icon as any}
                size={20}
                color={error ? "#ef476f" : "#8d99ae"}
              />
            </View>
          )}
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            style={[tw`flex-1 p-4`, { color: "#2b2d42", fontSize: 16 }]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            autoCapitalize={
              keyboardType === "email-address" || secureTextEntry
                ? "none"
                : "words"
            }
          />
          {rightIcon}
        </View>
        {error && (
          <Text style={[tw`text-sm mt-1 ml-1`, { color: "#ef476f" }]}>
            {error}
          </Text>
        )}
      </View>
    );
  };

  const turkishIdValidator = new TurkishIdentityValidation();

  if (waitingForVerification) {
    return (
      <View style={tw`flex-1 justify-center items-center p-6 bg-white`}>
        <View
          style={[
            tw`p-8 rounded-2xl items-center`,
            {
              backgroundColor: "#f8f9fa",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 15,
              elevation: 5,
            },
          ]}>
          <Ionicons name="mail" size={60} color={tw.colors.primary} />
          <Text
            style={[
              tw`text-xl text-center mt-4 mb-6`,
              { color: "#2b2d42", fontWeight: "600" },
            ]}>
            {intl.formatMessage({ id: "verifyEmailPrompt" })}
          </Text>
          <ActivityIndicator size="large" color={tw.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Fixed Header */}
      <View style={tw`pt-8 px-5 bg-white shadow-sm`}>
        <View style={tw`max-w-md w-full mx-auto`}>
          {/* Header */}
          <View style={tw`mb-4 items-center`}>
            <Text
              style={[tw`text-3xl mb-2 text-primary`, { fontWeight: "bold" }]}>
              {intl.formatMessage({ id: "createAccount" })}
            </Text>
            <Text style={[tw`text-base text-center`, { color: "#8d99ae" }]}>
              {intl.formatMessage({ id: "joinUs" })}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Form Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 bg-white`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={formScrollStyle}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          bounces={true}>
          <View style={tw`max-w-md w-full mx-auto`}>
            {/* Profile Picture */}
            <View style={tw`items-center mb-6`}>
              <TouchableOpacity
                style={[
                  tw`h-24 w-24 rounded-full justify-center items-center overflow-hidden`,
                  {
                    backgroundColor: "#f1f3f5",
                    borderWidth: 2,
                    borderColor: profilePicture ? tw.colors.primary : "#e9ecef",
                  },
                ]}
                onPress={pickImage}>
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={tw`items-center`}>
                    <Ionicons name="person" size={30} color="#8d99ae" />
                    <Text style={[tw`text-xs mt-1`, { color: "#8d99ae" }]}>
                      {intl.formatMessage({ id: "selectProfilePicture" })}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.profilePicture && (
                <Text style={[tw`text-sm mt-1`, { color: "#ef476f" }]}>
                  {errors.profilePicture}
                </Text>
              )}
            </View>

            {/* Form Fields */}
            <View style={tw`mb-4`}>
              {/* Name and Surname in a row */}
              <View style={tw`flex-row mb-4`}>
                <View style={tw`flex-1 mr-2`}>
                  {renderInputField(
                    intl.formatMessage({ id: "name" }),
                    name,
                    setName,
                    errors.name,
                    "default",
                    false,
                    undefined,
                    "person-outline"
                  )}
                </View>
                <View style={tw`flex-1 ml-2`}>
                  {renderInputField(
                    intl.formatMessage({ id: "surname" }),
                    surname,
                    setSurname,
                    errors.surname,
                    "default",
                    false,
                    undefined,
                    "people-outline"
                  )}
                </View>
              </View>

              {/* Email */}
              {renderInputField(
                intl.formatMessage({ id: "EML" }),
                email,
                setEmail,
                errors.email,
                "email-address",
                false,
                undefined,
                "mail-outline"
              )}

              {/* Password */}
              {renderInputField(
                intl.formatMessage({ id: "PSSWRD" }),
                password,
                setPassword,
                errors.password,
                "default",
                !showPassword,
                undefined,
                "lock-closed-outline",
                <TouchableOpacity
                  style={tw`pr-4`}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#8d99ae"
                  />
                </TouchableOpacity>
              )}

              {/* Phone Number */}
              {renderInputField(
                intl.formatMessage({ id: "phonePlaceholder" }),
                phone,
                (text) => {
                  const formatted = text
                    .replace(/[^0-9+]/g, "")
                    .replace(/(?!^\+)^\+/g, "")
                    .replace(/^00/, "00")
                    .replace(/^([^0+]).*/, "$1")
                    .replace(/^0([^0]).*/, "0$1")
                    .replace(/^\+([^0-9]).*/, "+");
                  setPhone(formatted);
                },
                errors.phone,
                "phone-pad",
                false,
                15,
                "call-outline"
              )}

              {/* ID Number */}
              {renderInputField(
                intl.formatMessage({ id: "turkishIdPlaceholder" }),
                idNumber,
                (text) => {
                  const numbersOnly = text.replace(/[^0-9]/g, "");
                  setIdNumber(numbersOnly);
                },
                errors.idNumber,
                "numeric",
                false,
                11,
                "card-outline"
              )}

              {/* Birthday (Year Only) */}
              {renderInputField(
                intl.formatMessage({ id: "birthYearPlaceholder" }),
                birthday,
                (input) => {
                  let numbersOnly = input.replace(/[^0-9]/g, "");
                  if (
                    numbersOnly.length >= 1 &&
                    !["1", "2"].includes(numbersOnly[0])
                  ) {
                    numbersOnly = "";
                  }
                  if (
                    numbersOnly.length >= 2 &&
                    numbersOnly[0] === "1" &&
                    numbersOnly[1] !== "9"
                  ) {
                    numbersOnly = numbersOnly.slice(0, 1);
                  }
                  if (
                    numbersOnly.length >= 2 &&
                    numbersOnly[0] === "2" &&
                    numbersOnly[1] !== "0"
                  ) {
                    numbersOnly = numbersOnly.slice(0, 1);
                  }
                  setBirthday(numbersOnly);
                },
                errors.birthday,
                "numeric",
                false,
                4,
                "calendar-outline"
              )}

              {/* Country Picker */}
              <View style={tw`mb-4`}>
                <View
                  style={[
                    tw`border rounded-xl overflow-hidden flex-row items-center`,
                    {
                      borderColor: errors.country ? "#ef476f" : "#e9ecef",
                      backgroundColor: "#ffffff",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 1,
                      elevation: 1,
                    },
                  ]}>
                  <View style={tw`pl-4 pr-2`}>
                    <Ionicons name="flag-outline" size={20} color="#8d99ae" />
                  </View>
                  <CustomPicker
                    value={country}
                    options={countryOptions}
                    onChange={setCountry}
                    placeholder={intl.formatMessage({ id: "selectCountry" })}
                    containerStyle={tw`flex-1 py-2`}
                  />
                </View>
                {errors.country && (
                  <Text style={[tw`text-sm mt-1 ml-1`, { color: "#ef476f" }]}>
                    {errors.country}
                  </Text>
                )}
              </View>

              {/* Business Account Toggle */}
              <View
                style={[
                  tw`flex-row justify-between items-center w-full mb-6 p-4 rounded-xl`,
                  {
                    backgroundColor: "#f1f3f5",
                  },
                ]}>
                <View style={tw`flex-row items-center`}>
                  <Ionicons
                    name="business-outline"
                    size={22}
                    color={isBusiness ? tw.colors.primary : "#8d99ae"}
                    style={tw`mr-3`}
                  />
                  <Text
                    style={[
                      tw`text-base`,
                      {
                        color: isBusiness ? tw.colors.primary : "#2b2d42",
                        fontWeight: isBusiness ? "600" : "normal",
                      },
                    ]}>
                    {intl.formatMessage({ id: "businessAccount" })}
                  </Text>
                </View>
                <Switch
                  value={isBusiness}
                  onValueChange={setIsBusiness}
                  trackColor={{ false: "#e9ecef", true: tw.colors.primary }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#e9ecef"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                tw`w-full py-4 rounded-xl mb-4 bg-primary`,
                {
                  shadowColor: tw.colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
              activeOpacity={0.8}
              onPress={onSignup}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={[
                    tw`text-center text-lg`,
                    { color: "#fff", fontWeight: "600" },
                  ]}>
                  {intl.formatMessage({ id: "signUp" })}
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={tw`mb-4`}>
              <Text style={[tw`text-center`, { color: "#8d99ae" }]}>
                {intl.formatMessage({ id: "alreadyHaveAccount" })}{" "}
                <Text style={tw`text-primary font-bold`}>
                  {intl.formatMessage({ id: "login" })}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;
