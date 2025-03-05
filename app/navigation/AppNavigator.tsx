import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Import useUser

import LoginScreen from "../screens/auth/LoginScreen";
import LoginSelectScreen from "../screens/auth/LoginSelectScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import BusinessHome from "../screens/BusinessHome";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        component={user?.isBusiness ? BusinessHome : HomeScreen} // Conditionally render the component
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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
      setInitialRoute("HomeTabs"); // Navigate to HomeTabs if user exists
    } else {
      setInitialRoute("LoginSelect"); // Navigate to LoginSelect if no user exists
    }
  }, [user]);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute} // Set the initial route based on user state
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
