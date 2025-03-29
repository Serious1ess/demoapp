import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Import useUser

import LoginScreen from "../screens/auth/LoginScreen";
import LoginSelectScreen from "../screens/auth/LoginSelectScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ServiceScreen from "../screens/bussinssScreen/AddServiceScreen";
import BusinessHome from "../screens/bussinssScreen/BusinessHome";
import AppointmentConfirmationScreen from "../screens/customerScreen/AppointmentConfirmationScreen";
import DateTimeSelectionScreen from "../screens/customerScreen/DateTimeSelectionScreen";
import HomeScreen from "../screens/customerScreen/HomeScreen";
import ServiceSelectionScreen from "../screens/customerScreen/ServiceSelectionScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for customer appointment booking flow
const CustomerStack = createStackNavigator();

const CustomerBookingNavigator = () => {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerStack.Screen name="CustomerHome" component={HomeScreen} />
      <CustomerStack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
      />
      <CustomerStack.Screen
        name="DateTimeSelection"
        component={DateTimeSelectionScreen}
      />
      <CustomerStack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
      />
    </CustomerStack.Navigator>
  );
};
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="ServiceScreen" component={ServiceScreen} />
    </ProfileStack.Navigator>
  );
};

// Bottom Tabs with Language Selector in Header
const HomeTabs = () => {
  const { user } = useUser(); // Access user data from context

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "#666",
      }}>
      <Tab.Screen
        name="Home"
        component={user?.isBusiness ? BusinessHome : CustomerBookingNavigator} // Use the nested navigator for customer screens
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useUser(); // Access user data from context
  const [initialRoute, setInitialRoute] = useState("LoginSelect"); // Default initial route

  useEffect(() => {
    // Check if a user is already logged in
    if (user) {
      console.log(user);
      setInitialRoute("HomeTabs"); // Navigate to HomeTabs if user exists
    }
    // } else {
    //   setInitialRoute("LoginSelect"); // Navigate to LoginSelect if no user exists
    // }
  }, [user]);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute} // Set the initial route based on user state
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
