import { Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
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
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomPicker from "../../components/CustomPicker";
import { handleSignup } from "../../supabase/auth";
import TurkishIdentityValidation from "../../supabase/utils/turkishIdcheck";

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
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
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

    if (!email) {
      newErrors.email = intl.formatMessage({ id: "emailRequired" });
      isValid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = intl.formatMessage({ id: "passwordRequired" });
      isValid = false;
    }
    if (!name) {
      newErrors.name = intl.formatMessage({ id: "nameRequired" });
      isValid = false;
    }
    if (!surname) {
      newErrors.surname = intl.formatMessage({ id: "surnameRequired" });
      isValid = false;
    }
    if (!phone) {
      newErrors.phone = intl.formatMessage({ id: "phoneRequired" });
      isValid = false;
    }
    if (!idNumber) {
      newErrors.idNumber = intl.formatMessage({ id: "idRequired" });
      isValid = false;
    } else {
      const isValidId = turkishIdValidator.validate(idNumber);
      if (!isValidId) {
        newErrors.idNumber = intl.formatMessage({ id: "invalidId" });
        isValid = false;
      }
    }
    if (!birthday) {
      newErrors.birthday = intl.formatMessage({ id: "birthdayRequired" });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSignup = async () => {
    try {
      const isValid = await validateForm();
      if (!isValid) return;

      setLoading(true);
      setWaitingForVerification(true);

      await handleSignup(
        email,
        password,
        name,
        surname,
        phone,
        idNumber,
        isBusiness,
        birthday,
        profilePicture,
        profileImageChanged,
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
    icon?: string
  ) => {
    return (
      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          {icon && <Feather name={icon} size={16} color="#667eea" />}
          <Text style={styles.labelText}>{placeholder}</Text>
        </View>
        <View style={[styles.inputContainer, error && styles.inputError]}>
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            style={styles.input}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            autoCapitalize={
              keyboardType === "email-address" || secureTextEntry
                ? "none"
                : "words"
            }
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            editable={!loading}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  const turkishIdValidator = new TurkishIdentityValidation();

  if (waitingForVerification) {
    return (
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <View style={styles.verificationContainer}>
          <View style={styles.verificationBadge}>
            <Feather name="mail" size={50} color="white" />
          </View>
          <Text style={styles.verificationTitle}>
            {intl.formatMessage({ id: "verifyEmailPrompt" })}
          </Text>
          <ActivityIndicator size="large" color="white" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {Platform.OS === "web" ? (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          style={styles.webScroll}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginSelect")}
              style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoBadge}>
                <Feather name="user-plus" size={40} color="white" />
              </View>
            </View>

            <Text style={styles.mainTitle}>
              {intl.formatMessage({ id: "createAccount" })}
            </Text>
            <Text style={styles.subtitle}>
              {intl.formatMessage({ id: "joinUs" })}
            </Text>
          </View>

          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.profilePicture} onPress={pickImage}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Feather
                    name="camera"
                    size={32}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                  <Text style={styles.profileText}>
                    {intl.formatMessage({ id: "selectProfilePicture" })}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.profilePicture && (
              <Text style={styles.errorText}>{errors.profilePicture}</Text>
            )}
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {renderInputField(
              intl.formatMessage({ id: "EML" }),
              email,
              setEmail,
              errors.email,
              "email-address",
              false,
              undefined,
              "mail"
            )}

            {renderInputField(
              intl.formatMessage({ id: "PSSWRD" }),
              password,
              setPassword,
              errors.password,
              "default",
              !showPassword,
              undefined,
              "lock"
            )}

            {renderInputField(
              intl.formatMessage({ id: "firstName" }),
              name,
              setName,
              errors.name,
              "default",
              false,
              undefined,
              "user"
            )}

            {renderInputField(
              intl.formatMessage({ id: "lastName" }),
              surname,
              setSurname,
              errors.surname,
              "default",
              false,
              undefined,
              "user"
            )}

            {renderInputField(
              intl.formatMessage({ id: "phone" }),
              phone,
              setPhone,
              errors.phone,
              "phone-pad",
              false,
              undefined,
              "phone"
            )}

            {renderInputField(
              intl.formatMessage({ id: "idNumber" }),
              idNumber,
              setIdNumber,
              errors.idNumber,
              "numeric",
              false,
              11,
              "id-card"
            )}

            {renderInputField(
              intl.formatMessage({ id: "birthday" }),
              birthday,
              setBirthday,
              errors.birthday,
              "default",
              false,
              undefined,
              "calendar"
            )}

            {/* Business Toggle */}
            <View style={styles.toggleSection}>
              <View style={styles.toggleLabel}>
                <Feather name="briefcase" size={16} color="#667eea" />
                <Text style={styles.labelText}>
                  {intl.formatMessage({ id: "signUpAsABusiness" })}
                </Text>
              </View>
              <Switch
                value={isBusiness}
                onValueChange={setIsBusiness}
                trackColor={{
                  false: "rgba(255, 255, 255, 0.2)",
                  true: "rgba(255, 255, 255, 0.4)",
                }}
                thumbColor={isBusiness ? "#ffed4e" : "rgba(255, 255, 255, 0.6)"}
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSignup}
              disabled={loading}>
              <LinearGradient
                colors={["#5a67d8", "#4c51bf"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.signupButton, loading && styles.buttonDisabled]}>
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator color="white" size="large" />
                  ) : (
                    <>
                      <Feather name="user-check" size={20} color="white" />
                      <Text style={styles.signupButtonText}>
                        {intl.formatMessage({ id: "signUp" })}
                      </Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              {intl.formatMessage({ id: "alreadyHaveAccount" })}{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>
                {intl.formatMessage({ id: "login" })}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginSelect")}
                style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <View style={styles.logoBadge}>
                  <Feather name="user-plus" size={40} color="white" />
                </View>
              </View>

              <Text style={styles.mainTitle}>
                {intl.formatMessage({ id: "createAccount" })}
              </Text>
              <Text style={styles.subtitle}>
                {intl.formatMessage({ id: "joinUs" })}
              </Text>
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={styles.profilePicture}
                onPress={pickImage}>
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Feather
                      name="camera"
                      size={32}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                    <Text style={styles.profileText}>
                      {intl.formatMessage({ id: "selectProfilePicture" })}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.profilePicture && (
                <Text style={styles.errorText}>{errors.profilePicture}</Text>
              )}
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {renderInputField(
                intl.formatMessage({ id: "EML" }),
                email,
                setEmail,
                errors.email,
                "email-address",
                false,
                undefined,
                "mail"
              )}

              {renderInputField(
                intl.formatMessage({ id: "PSSWRD" }),
                password,
                setPassword,
                errors.password,
                "default",
                !showPassword,
                undefined,
                "lock"
              )}

              {renderInputField(
                intl.formatMessage({ id: "namee" }),
                name,
                setName,
                errors.name,
                "default",
                false,
                undefined,
                "user"
              )}

              {renderInputField(
                intl.formatMessage({ id: "surname" }),
                surname,
                setSurname,
                errors.surname,
                "default",
                false,
                undefined,
                "user"
              )}

              {renderInputField(
                intl.formatMessage({ id: "phone" }),
                phone,
                setPhone,
                errors.phone,
                "phone-pad",
                false,
                undefined,
                "phone"
              )}

              {renderInputField(
                intl.formatMessage({ id: "turId" }),
                idNumber,
                setIdNumber,
                errors.idNumber,
                "numeric",
                false,
                11,
                "id-card"
              )}

              {renderInputField(
                intl.formatMessage({ id: "birthDate" }),
                birthday,
                setBirthday,
                errors.birthday,
                "numeric",
                false,
                10,
                "calendar"
              )}

              <View style={styles.pickerContainer}>
                <View style={styles.inputLabel}>
                  <Feather name="globe" size={16} color="#667eea" />
                  <Text style={styles.labelText}>
                    {intl.formatMessage({ id: "country" })}
                  </Text>
                </View>
                <CustomPicker
                  selectedValue={country}
                  onValueChange={setCountry}
                  items={countryOptions}
                />
              </View>

              <View style={styles.businessToggle}>
                <View style={styles.toggleLeft}>
                  <Feather name="briefcase" size={18} color="#667eea" />
                  <Text style={styles.toggleLabel}>
                    {intl.formatMessage({ id: "businessAccount" })}
                  </Text>
                </View>
                <Switch
                  value={isBusiness}
                  onValueChange={setIsBusiness}
                  trackColor={{
                    false: "rgba(255, 255, 255, 0.2)",
                    true: "#667eea",
                  }}
                  thumbColor="white"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSignup}
                disabled={loading}>
                <LinearGradient
                  colors={["#5a67d8", "#4c51bf"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.signupButton,
                    loading && styles.buttonDisabled,
                  ]}>
                  <View style={styles.buttonContent}>
                    {loading ? (
                      <ActivityIndicator color="white" size="large" />
                    ) : (
                      <>
                        <Feather name="user-check" size={20} color="white" />
                        <Text style={styles.signupButtonText}>
                          {intl.formatMessage({ id: "signUp" })}
                        </Text>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>
                {intl.formatMessage({ id: "alreadyHaveAccount" })}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>
                  {intl.formatMessage({ id: "login" })}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webScroll: {
    flex: 1,
    overflow: "auto",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },

  logoContainer: {
    marginBottom: 20,
  },

  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "500",
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profilePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 6,
    textAlign: "center",
  },

  formSection: {
    marginBottom: 30,
    gap: 18,
  },

  inputGroup: {
    gap: 8,
  },

  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  labelText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
  },

  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  inputError: {
    borderColor: "#ff6b6b",
  },

  input: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  toggleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  toggleLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonSection: {
    marginBottom: 20,
  },

  signupButton: {
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
  },

  loginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },

  loginLink: {
    color: "#ffed4e",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  verificationBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  verificationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default SignupScreen;
