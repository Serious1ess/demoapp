import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useUser } from "../context/UserContext";
import LoginScreen from "../screens/auth/LoginScreen";
import LoginSelectScreen from "../screens/auth/LoginSelectScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ServiceScreen from "../screens/bussinssScreen/AddServiceScreen";
import CustomerDashboard from "../screens/customerScreen/customerDashboard";
import EditProfileScreen from "../screens/editProfileScreen";
import NotificationsScreen from "../screens/notification";
import AuthNavigator from "./AuthNavigator";
import CustomerBookingNavigator from "./CustomerBookingNavigator";
import HomeTabs from "./HomeTabs";

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

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
      <Stack.Screen name="Auth" component={AuthNavigator} />
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
          headerShown: true,
          title: "Notifications",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#4b8494" },
          headerTintColor: "#fff",
          headerLeft: ({ onPress }) => (
            <TouchableOpacity
              onPress={onPress}
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