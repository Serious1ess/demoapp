import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator as RNActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useUser } from "../context/UserContext";
import { handleUpdateProfile } from "../supabase/auth";
import tw from "../utils/tw";

const EditProfileScreen = ({ navigation }) => {
  const { user, loading, setUser } = useUser();
  const intl = useIntl();
  const locale = useIntl().defaultLocale;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    phone: user?.phone || "",
    birthYear: user?.birth_year?.toString() || "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing in a field with error
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        intl.formatMessage({ id: "firstNameRequired" }) ||
        "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        intl.formatMessage({ id: "lastNameRequired" }) ||
        "Last name is required";
    }

    if (formData.birthYear && isNaN(parseInt(formData.birthYear))) {
      newErrors.birthYear =
        intl.formatMessage({ id: "invalidBirthYear" }) ||
        "Birth year must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const updatedData = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.trim(),
      birth_year: formData.birthYear ? parseInt(formData.birthYear) : null,
    };

    try {
      const { success } = await handleUpdateProfile(
        updatedData,
        user.id,
        setUser
      );

      if (success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4a6fa5" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-lg mb-4`}>
          {intl.formatMessage({ id: "noUserLoggedIn" }) || "No user logged in"}
        </Text>
        <TouchableOpacity
          style={tw`bg-primary py-3 px-6 rounded-lg`}
          onPress={() => navigation.navigate("Login")}>
          <Text style={tw`text-white font-bold`}>
            {intl.formatMessage({ id: "goToLogin" }) || "Go to Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow p-4 bg-gray-50`}
      style={{ direction: locale === "ar" ? "rtl" : "ltr" }}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
          {intl.formatMessage({ id: "editProfile" }) || "Edit Profile"}
        </Text>
        <Text style={tw`text-gray-600`}>
          {intl.formatMessage({ id: "updateYourInformation" }) ||
            "Update your personal information"}
        </Text>
      </View>

      <View style={tw`bg-white rounded-lg shadow-md p-6 mb-6`}>
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2`}>
            {intl.formatMessage({ id: "firstName" }) || "First Name"}
            <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } p-2 rounded-md`}
            value={formData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
          />
          {errors.firstName && (
            <Text style={tw`text-red-500 text-sm mt-1`}>
              {errors.firstName}
            </Text>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2`}>
            {intl.formatMessage({ id: "lastName" }) || "Last Name"}
            <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <TextInput
            style={tw`border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } p-2 rounded-md`}
            value={formData.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
          />
          {errors.lastName && (
            <Text style={tw`text-red-500 text-sm mt-1`}>{errors.lastName}</Text>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2`}>
            {intl.formatMessage({ id: "phone" }) || "Phone"}
          </Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded-md`}
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2`}>
            {intl.formatMessage({ id: "birthYear" }) || "Birth Year"}
          </Text>
          <TextInput
            style={tw`border ${
              errors.birthYear ? "border-red-500" : "border-gray-300"
            } p-2 rounded-md`}
            value={formData.birthYear}
            onChangeText={(text) => handleInputChange("birthYear", text)}
            keyboardType="number-pad"
          />
          {errors.birthYear && (
            <Text style={tw`text-red-500 text-sm mt-1`}>
              {errors.birthYear}
            </Text>
          )}
        </View>
      </View>

      <View style={tw`w-full`}>
        <TouchableOpacity
          style={tw`bg-primary py-3 rounded-lg items-center mb-4 ${
            isSubmitting ? "opacity-70" : ""
          }`}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <RNActivityIndicator color="#ffffff" />
          ) : (
            <Text style={tw`text-white font-bold text-lg`}>
              {intl.formatMessage({ id: "saveChanges" }) || "Save Changes"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-gray-600 py-3 rounded-lg items-center`}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}>
          <Text style={tw`text-white font-bold text-lg`}>
            {intl.formatMessage({ id: "cancel" }) || "Cancel"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
