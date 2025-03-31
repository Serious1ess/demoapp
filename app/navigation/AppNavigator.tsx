import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useUser } from "../context/UserContext";
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

// Auth Stack - Group all auth screens together
const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </AuthStack.Navigator>
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
          headerShown: false,
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
      setInitialRoute(user ? "MainApp" : "Auth");
      console.log("Auth state resolved:", user ? "Logged in" : "Not logged in");
    }
  }, [user, loading]);

  if (loading || initialRoute === null) {
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
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="MainApp" component={HomeTabs} />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <AuthStack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
