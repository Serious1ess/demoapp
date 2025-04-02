import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useUser } from "../context/UserContext";
import { getAppointmentServices } from "../supabase/busuniss";
import { supabase } from "../supabase/supabase";

const NotificationsScreen = () => {
  const { user, notifications } = useUser();
  const fullname = user?.user_metadata?.full_name || "Business Owner";
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current date without time for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const notificationDate = new Date(notification.created_at);
    return (
      notificationDate.setHours(0, 0, 0, 0) === today.getTime() ||
      (notification.status === "pending" && notificationDate > today)
    );
  });

  // Handle notification click
  const handleNotificationPress = async (notification) => {
    try {
      const servicesData = await getAppointmentServices(
        notification.appointment_id
      );
      setServices(servicesData);
      setSelectedNotification(notification);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Handle approve action
  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("approve_appointment", {
        _appointment_id: selectedNotification.appointment_id,
      });

      if (error) throw error;

      // Optional: Refresh notifications or update local state
      console.log("Appointment approved successfully");
      selectedNotification.status = "confirmed";
      setModalVisible(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
      // Optionally show error to user
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("reject_appointment", {
        _appointment_id: selectedNotification.appointment_id,
      });

      if (error) throw error;

      // Optional: Refresh notifications or update local state
      console.log("Appointment rejected successfully");
      selectedNotification.status = "cancelled";
      setModalVisible(false);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      // Optionally show error to user
    } finally {
      setIsProcessing(false);
    }
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
  // get status color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "yellow",
      confirmed: "green",
      cancelled: "red",
      completed: "green",
    };
    return statusColors[status] || "gray"; // Return gray as fallback
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
              style={tw`bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-${getStatusColor(
                notification.status
              )}-400`}>
              <Text style={tw`text-gray-800 font-medium`}>
                {notification.message}
              </Text>
              <View style={tw`mt-2 flex-row justify-between items-center`}>
                <Text style={tw`text-xs text-gray-500`}>
                  {formatDate(notification.created_at)}
                </Text>
                <View
                  style={tw`px-2 py-1 rounded-full bg-${getStatusColor(
                    notification.status
                  )}-100`}>
                  <Text
                    style={tw`text-xs text-${getStatusColor(
                      notification.status
                    )}-800`}>
                    {notification.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Notification Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-lg p-6 w-11/12`}>
            <Text style={tw`text-xl font-bold mb-4`}>Appointment Details</Text>

            {selectedNotification && (
              <>
                <Text style={tw`text-gray-800 mb-2`}>
                  {selectedNotification.message}
                </Text>
                <Text style={tw`text-gray-500 text-sm mb-2`}>
                  Created: {formatDate(selectedNotification.created_at)}
                </Text>

                {services.length > 0 && (
                  <View style={tw`mb-4`}>
                    <Text style={tw`font-medium mb-1`}>Services:</Text>
                    {services.map((service, index) => (
                      <Text key={index} style={tw`text-gray-600`}>
                        • {service.service_name}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}

            <View style={tw`flex-row justify-between mt-4`}>
              <Pressable
                style={tw`px-4 py-2 bg-green-500 rounded-lg ${
                  isProcessing ? "opacity-50" : ""
                }`}
                onPress={handleApprove}
                disabled={isProcessing}>
                <Text style={tw`text-white font-medium`}>
                  {isProcessing ? "Processing..." : "Approve"}
                </Text>
              </Pressable>

              <Pressable
                style={tw`px-4 py-2 bg-red-500 rounded-lg ${
                  isProcessing ? "opacity-50" : ""
                }`}
                onPress={handleReject}
                disabled={isProcessing}>
                <Text style={tw`text-white font-medium`}>
                  {isProcessing ? "Processing..." : "Reject"}
                </Text>
              </Pressable>
              <Pressable
                style={tw`px-4 py-2 bg-gray-300 rounded-lg`}
                onPress={() => setModalVisible(false)}>
                <Text style={tw`text-gray-800 font-medium`}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationsScreen;
