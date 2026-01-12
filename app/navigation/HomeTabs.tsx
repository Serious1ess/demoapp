import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../context/UserContext";
import BusinessHome from "../screens/bussinssScreen/BusinessHome";
import CustomerDashboard from "../screens/customerScreen/customerDashboard";
import CustomerBookingNavigator from "./CustomerBookingNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { user, notifications } = useUser();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#4b8494" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#4b8494",
        tabBarInactiveTintColor: "#666",
        tabBarShowLabel: false,
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
      }}>
      <Tab.Screen
        name="Home"
        component={user?.isBusiness ? BusinessHome : CustomerBookingNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          title: user?.isBusiness ? "Business Dashboard" : "Book Services",
        }}
      />

      {!user?.isBusiness && (
        <Tab.Screen
          name="CustomerDashboard"
          component={CustomerDashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" color={color} size={size} />
            ),
            title: "Appointments",
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          title: "My Profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;