import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { Text } from "react-native";
import { useUser } from "../context/UserContext";
import LoginScreen from "../screens/auth/LoginScreen";
import LoginSelectScreen from "../screens/auth/LoginSelectScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ServiceScreen from "../screens/bussinssScreen/AddServiceScreen";
import BusinessHome from "../screens/bussinssScreen/BusinessHome";
import AppointmentConfirmationScreen from "../screens/customerScreen/AppointmentConfirmationScreen";
import CustomerDashboard from "../screens/customerScreen/customerDashboard";
import DateTimeSelectionScreen from "../screens/customerScreen/DateTimeSelectionScreen";
import HomeScreen from "../screens/customerScreen/HomeScreen";
import ServiceSelectionScreen from "../screens/customerScreen/ServiceSelectionScreen";
import EditProfileScreen from "../screens/editProfileScreen";
import NotificationsScreen from "../screens/notification";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for customer appointment booking flow
const CustomerStack = createStackNavigator();
const CustomerBookingNavigator = () => {
  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerShown: true,
        // Optional: You can set some default header styles here
        headerStyle: {
          backgroundColor: "#f5f5f5", // example background color
        },
        headerTitleStyle: {
          fontWeight: "bold", // example title style
        },
      }}>
      <CustomerStack.Screen
        name="CustomerHome"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
        // options={{ headerShown: false }}
      />
      <CustomerStack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
        options={{ title: "Select Service" }}
      />
      <CustomerStack.Screen
        name="DateTimeSelection"
        component={DateTimeSelectionScreen}
        options={{ title: "Select Date & Time" }}
      />
      <CustomerStack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
        options={{ title: "Confirmation" }}
      />
    </CustomerStack.Navigator>
  );
};

// Auth Stack - Group all auth screens together
const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen
        name="LoginSelect"
        component={LoginSelectScreen}
        options={{ headerShown: false, title: "" }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true, title: "" }}
      />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </AuthStack.Navigator>
  );
};
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  const { user, notifications } = useUser();
  const navigation = useNavigation(); // Add this hook
  return (
    <ProfileStack.Navigator
      screenOptions={({ navigation: nav }) => ({
        // Rename to avoid conflict
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
            onPress={() => navigation.navigate("notification")} // Fixed navigation
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
// Bottom Tabs with custom header
const HomeTabs = () => {
  const { user, notifications } = useUser();
  const navigation = useNavigation(); // Add this hook

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#4b8494" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#4b8494",
        tabBarInactiveTintColor: "#666",
        tabBarShowLabel: false, // <--- THIS hides tab titles
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
      <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
      <Stack.Screen
        name="CustomerBookingNavigator"
        component={CustomerBookingNavigator}
      />

      <Stack.Screen
        name="notification"
        component={NotificationsScreen}
        options={{
          headerShown: true, // Explicitly show header for this screen
          title: "Notifications",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#4b8494" },
          headerTintColor: "#fff",
          headerLeft: ({ onPress }) => (
            <TouchableOpacity
              onPress={onPress} // Use the provided onPress handler
              style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <AuthStack.Screen name="LoginSelect" component={LoginSelectScreen} />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: true }}
      />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
