import React from "react";
import { useIntl } from "react-intl";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";
import LanguageSelector from "../components/LanguageSelector";
import { useUser } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
  const { user, loading, logout } = useUser();

  const intl = useIntl();
  const locale = useIntl().defaultLocale;

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
          {intl.formatMessage({ id: "noUserLoggedIn" })}
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-600 py-3 px-6 rounded-lg`}
          onPress={() => navigation.navigate("Login")}>
          <Text style={tw`text-white font-bold`}>
            {intl.formatMessage({ id: "goToLogin" })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow p-4 bg-gray-50`}
      style={{ direction: locale === "ar" ? "rtl" : "ltr" }}>
      {/* Profile Header */}
      <View style={tw`items-center mb-8`}>
        {user?.profile_picture ? (
          <Image
            source={{ uri: user.profile_picture }}
            style={tw`w-32 h-32 rounded-full mb-4 border-4 border-blue-500`}
          />
        ) : (
          <View style={tw`mb-4`}>
            <Ionicons
              name="person-circle-outline"
              size={120}
              style={tw`text-blue-500`}
            />
          </View>
        )}

        <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>
          {user?.full_name ||
            `${user?.first_name} ${user?.last_name}` ||
            intl.formatMessage({ id: "user" })}
        </Text>
        <Text style={tw`text-gray-600`}>{user?.email}</Text>
      </View>

      {/* Profile Details Card */}
      <View style={tw`bg-white rounded-lg shadow-md p-6 mb-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="call-outline"
            size={20}
            style={tw`text-blue-500 ${locale === "ar" ? "ml-2" : "mr-2"}`}
          />
          <Text style={tw`text-gray-700`}>
            {user?.phone || intl.formatMessage({ id: "notProvided" })}
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="calendar-outline"
            size={20}
            style={tw`text-blue-500 ${locale === "ar" ? "ml-2" : "mr-2"}`}
          />
          <Text style={tw`text-gray-700`}>
            {user?.birth_year
              ? intl.formatMessage({ id: "bornIn" }, { year: user.birth_year })
              : intl.formatMessage({ id: "birthYearNotSet" })}
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="location-outline"
            size={20}
            style={tw`text-blue-500 ${locale === "ar" ? "ml-2" : "mr-2"}`}
          />
          <Text style={tw`text-gray-700`}>
            {user?.country || intl.formatMessage({ id: "defaultCountry" })}
          </Text>
        </View>

        {user?.id_number && (
          <View style={tw`flex-row items-center`}>
            <Ionicons
              name="id-card-outline"
              size={20}
              style={tw`text-blue-500 ${locale === "ar" ? "ml-2" : "mr-2"}`}
            />
            <Text style={tw`text-gray-700`}>
              {intl.formatMessage({ id: "idNumber" })}: ••••••
              {user.id_number.slice(-4)}
            </Text>
          </View>
        )}
      </View>

      {/* Business Badge */}
      {user?.isBusiness && (
        <View
          style={tw`flex-row items-center justify-center bg-blue-600 py-2 px-4 rounded-full mb-6 self-center`}>
          <Ionicons
            name="business-outline"
            size={18}
            style={tw`text-white ${locale === "ar" ? "ml-2" : "mr-2"}`}
          />
          <Text style={tw`text-white font-bold`}>
            {intl.formatMessage({ id: "businessAccount" })}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={tw`w-full`}>
        <LanguageSelector />

        <TouchableOpacity
          style={tw`bg-blue-600 py-3 rounded-lg items-center mb-4`}
          onPress={() => navigation.navigate("EditProfile")}>
          <Text style={tw`text-white font-bold text-lg`}>
            {intl.formatMessage({ id: "editProfile" })}
          </Text>
        </TouchableOpacity>

        {user?.isBusiness && (
          <TouchableOpacity
            style={tw`bg-gray-600 py-3 rounded-lg items-center mb-4`}
            onPress={() => navigation.navigate("ServiceScreen")}>
            <Text style={tw`text-white font-bold text-lg`}>
              {intl.formatMessage({ id: "manageServices" })}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-lg items-center`}
          onPress={() => {
            logout();
            navigation.navigate("LoginSelect");
          }}>
          <Text style={tw`text-white font-bold text-lg`}>
            {intl.formatMessage({ id: "logout" })}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
