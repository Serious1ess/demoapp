import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useUser } from "../context/UserContext";
import EditProfileScreen from "../screens/editProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ServiceScreen from "../screens/bussinssScreen/AddServiceScreen";

const ProfileStack = createStackNavigator();

const ProfileNavigator = () => {
  const { user, notifications } = useUser();
  const navigation = useNavigation();
  
  return (
    <ProfileStack.Navigator
      screenOptions={({ navigation: nav }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#4b8494" },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("notification")}
            style={{ marginRight: 15 }}>
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {notifications.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -5,
                    top: -5,
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "white", fontSize: 10 }}>
                    {notifications.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      })}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <ProfileStack.Screen
        name="ServiceScreen"
        component={ServiceScreen}
        options={{ title: "Services" }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigator;