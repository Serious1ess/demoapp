import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AppointmentConfirmationScreen from "../screens/customerScreen/AppointmentConfirmationScreen";
import DateTimeSelectionScreen from "../screens/customerScreen/DateTimeSelectionScreen";
import HomeScreen from "../screens/customerScreen/HomeScreen";
import ServiceSelectionScreen from "../screens/customerScreen/ServiceSelectionScreen";

const CustomerStack = createStackNavigator();

const CustomerBookingNavigator = () => {
  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}>
      <CustomerStack.Screen
        name="CustomerHome"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
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

export default CustomerBookingNavigator;