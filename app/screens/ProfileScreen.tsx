import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";
import LanguageSelector from "../components/LanguageSelector";
import { useUser } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
  const { user, loading } = useUser();
  console.log("User data:", user);
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
        <Text style={tw`text-lg mb-4`}>No user logged in</Text>
        <TouchableOpacity
          style={tw`bg-blue-600 py-3 px-6 rounded-lg`}
          onPress={() => navigation.navigate("Login")}>
          <Text style={tw`text-white font-bold`}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4 bg-gray-50`}>
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
            "User"}
        </Text>
        <Text style={tw`text-gray-600`}>{user?.email}</Text>
      </View>

      {/* Profile Details Card */}
      <View style={tw`bg-white rounded-lg shadow-md p-6 mb-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="call-outline"
            size={20}
            style={tw`text-blue-500 mr-2`}
          />
          <Text style={tw`text-gray-700`}>{user?.phone || "Not provided"}</Text>
        </View>

        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="calendar-outline"
            size={20}
            style={tw`text-blue-500 mr-2`}
          />
          <Text style={tw`text-gray-700`}>
            {user?.birth_year
              ? `Born in ${user.birth_year}`
              : "Birth year not set"}
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons
            name="location-outline"
            size={20}
            style={tw`text-blue-500 mr-2`}
          />
          <Text style={tw`text-gray-700`}>{user?.country || "Turkey"}</Text>
        </View>

        {user?.id_number && (
          <View style={tw`flex-row items-center`}>
            <Ionicons
              name="id-card-outline"
              size={20}
              style={tw`text-blue-500 mr-2`}
            />
            <Text style={tw`text-gray-700`}>
              ID: ••••••{user.id_number.slice(-4)}
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
            style={tw`text-white mr-2`}
          />
          <Text style={tw`text-white font-bold`}>Business Account</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={tw`w-full`}>
        <LanguageSelector />

        <TouchableOpacity
          style={tw`bg-blue-600 py-3 rounded-lg items-center mb-4`}
          onPress={() => navigation.navigate("EditProfile")}>
          <Text style={tw`text-white font-bold text-lg`}>Edit Profile</Text>
        </TouchableOpacity>

        {user?.isBusiness && (
          <TouchableOpacity
            style={tw`bg-gray-600 py-3 rounded-lg items-center mb-4`}
            onPress={() => navigation.navigate("ServiceScreen")}>
            <Text style={tw`text-white font-bold text-lg`}>
              Manage Services
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-lg items-center`}
          onPress={() => navigation.replace("Login")}>
          <Text style={tw`text-white font-bold text-lg`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
