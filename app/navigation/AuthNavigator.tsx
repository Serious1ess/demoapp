import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "../screens/auth/LoginScreen";
import LoginSelectScreen from "../screens/auth/LoginSelectScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
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

export default AuthNavigator;