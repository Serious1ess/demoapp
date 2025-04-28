import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../context/UserContext";
import { getAppointmentServices } from "../supabase/busuniss";
import { supabase } from "../supabase/supabase";
import tw from "../utils/tw";
const NotificationsScreen = () => {
  const { user, notifications, setNotifications } = useUser();
  // const fullname = user?.user_metadata?.full_name || "User";
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Filter notifications based on user type
  const filteredNotifications = notifications;
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (user?.isBusiness) {
        query = query
          .eq("business_id", user.id)
          .or(
            `and(created_at.gte.${todayISO},created_at.lt.${new Date(
              today.getTime() + 86400000
            ).toISOString()}),and(status.eq.pending,created_at.gt.${todayISO})`
          );
      } else {
        query = query.eq("customer_id", user.id).gte("created_at", todayISO);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setNotifications(data);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);
  // Handle notification click
  const handleNotificationPress = async (notification) => {
    try {
      console.log("Notification pressed:", notification);

      if (user?.isBusiness) {
        // Business user flow
        if (notification.status !== "pending") return;
        const servicesData = await getAppointmentServices(
          notification.appointment_id
        );
        setServices(servicesData);
      }

      setSelectedNotification(notification);
      setModalVisible(true);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  // Handle approve action (for business only)
  const handleApprove = async () => {
    if (!user?.isBusiness) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("approve_appointment", {
        _appointment_id: selectedNotification.appointment_id,
      });

      if (error) throw error;

      console.log("Appointment approved successfully");
      selectedNotification.status = "confirmed";
      setModalVisible(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject action (for business only)
  const handleReject = async () => {
    if (!user?.isBusiness) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("reject_appointment", {
        _appointment_id: selectedNotification.appointment_id,
      });

      if (error) throw error;

      console.log("Appointment rejected successfully");
      selectedNotification.status = "cancelled";
      setModalVisible(false);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
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

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "yellow",
      confirmed: "green",
      cancelled: "red",
      completed: "green",
    };
    return statusColors[status] || "gray";
  };

  // Get appropriate message for customer notifications
  const getCustomerNotificationMessage = (notification) => {
    switch (notification.status) {
      case "pending":
        return "Your appointment request is being processed";
      case "confirmed":
        return "Your appointment has been confirmed";
      case "cancelled":
        return "Your appointment has been cancelled";
      case "completed":
        return "Your appointment has been completed";
      default:
        return notification.message + "by" + notification.business_name;
    }
  };
  const getBussnissNotificationMessage = (notification) => {
    return `
    New appointment from ${notification.customer_name}

    Duration: ${Math.floor(notification.duration_minutes / 60)}h ${
      notification.duration_minutes % 60
    }m
    Total Price: $${notification.total_price}

  `;
  };

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-500`}>Your notifications</Text>
        {/* Add refresh button for web */}
      </View>
      {/* <View> */}
      {/* {Platform.OS === "web" && ( */}
      <TouchableOpacity
        onPress={onRefresh}
        style={tw`p-2 rounded-full bg-blue-100 absolute top-2 right-4`}
        disabled={refreshing}>
        {refreshing ? (
          <ActivityIndicator color="#3b82f6" />
        ) : (
          <Ionicons name="refresh" size={24} color="#3b82f6" />
        )}
      </TouchableOpacity>
      {/* )} */}
      {/* </View> */}
      {filteredNotifications.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-400 text-lg`}>No notifications</Text>
        </View>
      ) : (
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow`} // Add this for web
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3b82f6"]} // blue-500 color
              tintColor="#3b82f6"
            />
          }>
          {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              style={tw`bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-${getStatusColor(
                notification.status
              )}-400`}>
              <Text style={tw`text-gray-800 font-medium`}>
                {user?.isBusiness
                  ? getBussnissNotificationMessage(notification)
                  : getCustomerNotificationMessage(notification)}
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
            <Text style={tw`text-xl font-bold mb-4`}>
              {user?.isBusiness ? "Appointment Details" : "Your Appointment"}
            </Text>

            {selectedNotification && (
              <>
                <Text style={tw`text-gray-800 mb-2`}>
                  {user?.isBusiness
                    ? selectedNotification.message
                    : getCustomerNotificationMessage(selectedNotification)}
                </Text>
                <Text style={tw`text-gray-500 text-sm mb-2`}>
                  {formatDate(selectedNotification.created_at)}
                </Text>

                {services.length > 0 && user?.isBusiness && (
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
              {user?.isBusiness ? (
                <>
                  <Pressable
                    style={tw`px-4 py-2 bg-green-500 rounded-lg ${
                      isProcessing ? "opacity-50" : ""
                    }`}
                    onPress={handleApprove}
                    disabled={
                      isProcessing || selectedNotification?.status !== "pending"
                    }>
                    <Text style={tw`text-white font-medium`}>
                      {isProcessing ? "Processing..." : "Approve"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={tw`px-4 py-2 bg-red-500 rounded-lg ${
                      isProcessing ? "opacity-50" : ""
                    }`}
                    onPress={handleReject}
                    disabled={
                      isProcessing || selectedNotification?.status !== "pending"
                    }>
                    <Text style={tw`text-white font-medium`}>
                      {isProcessing ? "Processing..." : "Reject"}
                    </Text>
                  </Pressable>
                </>
              ) : null}

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
