import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useUser } from "../context/UserContext";

const NotificationsScreen = () => {
  const { user, notifications } = useUser();
  const fullname = user?.user_metadata?.full_name || "Business Owner";

  // Get current date without time for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const notificationDate = new Date(notification.created_at);

    // Check if notification is from today OR is pending with future date
    return (
      notificationDate.setHours(0, 0, 0, 0) === today.getTime() ||
      (notification.status === "pending" && notificationDate > today)
    );
  });

  // Handle notification click
  const handleNotificationPress = (notification) => {
    console.log("Notification pressed:", notification);
    // Add your navigation or action here
    // Example: navigation.navigate('AppointmentDetails', { appointmentId: notification.appointment_id });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>
          Hello, {fullname}
        </Text>
        <Text style={tw`text-gray-500`}>Your recent notifications</Text>
      </View>

      {filteredNotifications.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-400 text-lg`}>No new notifications</Text>
        </View>
      ) : (
        <ScrollView style={tw`flex-1`}>
          {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              style={tw`bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 ${
                notification.status === "pending"
                  ? "border-yellow-400"
                  : "border-green-400"
              }`}>
              <Text style={tw`text-gray-800 font-medium`}>
                {notification.message}
              </Text>
              <View style={tw`mt-2 flex-row justify-between items-center`}>
                <Text style={tw`text-xs text-gray-500`}>
                  {formatDate(notification.created_at)}
                </Text>
                <View
                  style={tw`px-2 py-1 rounded-full ${
                    notification.status === "pending"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}>
                  <Text
                    style={tw`text-xs ${
                      notification.status === "pending"
                        ? "text-yellow-800"
                        : "text-green-800"
                    }`}>
                    {notification.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationsScreen;
