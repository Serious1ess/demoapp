import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
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
    <ProfileStack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log("Notification pressed")}
            style={{ marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
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
    </ProfileStack.Navigator>
  );
};

// Bottom Tabs with custom header
const HomeTabs = () => {
  const { user } = useUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "#666",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log("Notification pressed")}
            style={{ marginRight: 15 }}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
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
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          title: "My Profile",
          headerShown: false, // Hide header here since ProfileStack has its own
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useUser();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    if (!loading) {
      setInitialRoute(user ? "HomeTabs" : "LoginSelect");
    }
  }, [user, loading]);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
