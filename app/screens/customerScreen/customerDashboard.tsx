import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../supabase/supabase";
import tw from "../../utils/tw";

const CustomerDashboard = () => {
  const { user } = useUser();
  const fullname = user?.user_metadata?.full_name || "Customer";
  const customerId = user?.id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current date without time for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    fetchAppointments();
  }, [customerId, activeFilter]);

  const fetchAppointments = async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      let query = supabase
        .from("appointments")
        .select(
          `
          id,
          date,
          time,
          status,
          total_price,
          total_duration,
          created_at,
          profiles!appointments_business_id_fkey (id, full_name, phone),
          appointment_services (
            service_id,
            business_services (
              name,
              price,
              duration_minutes
            )
          )
        `
        )
        .eq("customer_id", customerId);

      // Apply date filtering based on activeFilter
      if (activeFilter === "upcoming") {
        query = query.gte("date", todayStr);
      } else if (activeFilter === "past") {
        query = query.lt("date", todayStr);
      }

      // Order by date and time
      query = query
        .order("date", { ascending: activeFilter !== "past" })
        .order("time", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Could not load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  // Format date and time for display
  const formatDateTime = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Handle cancel action
  const handleCancel = async () => {
    if (!selectedAppointment) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("cancel_appointment", {
        _appointment_id: selectedAppointment.id,
      });

      if (error) throw error;

      // Update the local state
      setAppointments(
        appointments.map((app) =>
          app.id === selectedAppointment.id
            ? { ...app, status: "cancelled" }
            : app
        )
      );

      Alert.alert("Success", "Appointment cancelled successfully");
      setModalVisible(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Alert.alert("Error", "Failed to cancel appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle mark completed action
  const handleMarkCompleted = async () => {
    if (!selectedAppointment) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("complete_appointment", {
        _appointment_id: selectedAppointment.id,
      });

      if (error) throw error;

      // Update the local state
      setAppointments(
        appointments.map((app) =>
          app.id === selectedAppointment.id
            ? { ...app, status: "completed" }
            : app
        )
      );

      Alert.alert("Success", "Appointment marked as completed");
      setModalVisible(false);
    } catch (error) {
      console.error("Error completing appointment:", error);
      Alert.alert("Error", "Failed to complete appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open action modal for appointment
  const openActionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Filter buttons
  const FilterButton = ({ title, filter }) => (
    <TouchableOpacity
      style={tw`px-4 py-2 rounded-full ${
        activeFilter === filter ? "bg-primary" : "bg-gray-200"
      }`}
      onPress={() => setActiveFilter(filter)}>
      <Text
        style={tw`text-center ${
          activeFilter === filter ? "text-white" : "text-gray-800"
        }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-primary-500";
      case "missed":
        return "bg-purple-500";
      case "incompleted":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Appointment card component
  const AppointmentCard = ({ item }) => {
    // Get business information
    const business = item.profiles || {};

    // Get service information
    const services = item.appointment_services || [];

    return (
      <TouchableOpacity
        style={tw`bg-white p-4 mb-4 rounded-lg shadow`}
        onPress={() => openActionModal(item)}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`font-bold text-lg`}>{business.full_name}</Text>
          <View style={tw`${getStatusColor(item.status)} px-2 py-1 rounded`}>
            <Text style={tw`text-white text-xs uppercase font-medium`}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={tw`text-gray-600 mb-2`}>
          {formatDateTime(item.date, item.time)}
        </Text>
        <Text style={tw`text-gray-600 mb-1`}>
          Phone: {business.phone || "Not provided"}
        </Text>

        <View style={tw`mt-2`}>
          <Text style={tw`font-medium mb-1`}>Services:</Text>
          {services.map((service, index) => (
            <Text key={index} style={tw`text-gray-600`}>
              • {service.business_services?.name} (
              {service.business_services?.price} TL)
            </Text>
          ))}
        </View>

        <View
          style={tw`flex-row justify-between mt-3 pt-2 border-t border-gray-200`}>
          <Text style={tw`font-medium`}>Total: {item.total_price} TL</Text>
          <Text style={tw`text-gray-600`}>{item.total_duration} min</Text>
        </View>

        {(item.status === "pending" || item.status === "confirmed") && (
          <Text style={tw`mt-2 text-gray-500 italic text-sm text-center`}>
            Tap to manage appointment
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-2`}>My Appointments</Text>
      <Text style={tw`text-gray-600 mb-4`}>
        View and manage your appointments
      </Text>

      {/* Filter tabs */}
      <View style={tw`flex-row justify-around my-4`}>
        <FilterButton title="Upcoming" filter="upcoming" />
        <FilterButton title="Past" filter="past" />
        <FilterButton title="All" filter="all" />
      </View>

      {/* Loading indicator */}
      {loading && !refreshing && (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Error message */}
      {error && (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-red-500`}>{error}</Text>
          <TouchableOpacity
            style={tw`mt-4 bg-primary-500 px-4 py-2 rounded`}
            onPress={fetchAppointments}>
            <Text style={tw`text-white`}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Appointments list */}
      {!loading && !error && (
        <>
          {appointments.length === 0 ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <Text style={tw`text-gray-500 text-lg`}>
                No appointments found
              </Text>
            </View>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <AppointmentCard item={item} />}
              contentContainerStyle={tw`pb-6`}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#4f46e5"]}
                />
              }
            />
          )}
        </>
      )}

      {/* Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-5 rounded-lg w-4/5 max-w-md`}>
            <Text style={tw`text-lg font-bold mb-4 text-center`}>
              Appointment Action
            </Text>

            {selectedAppointment && (
              <>
                <Text style={tw`mb-2`}>
                  Business: {selectedAppointment.profiles?.full_name}
                </Text>
                <Text style={tw`mb-4`}>
                  Date & Time:{" "}
                  {formatDateTime(
                    selectedAppointment.date,
                    selectedAppointment.time
                  )}
                </Text>
                <Text style={tw`mb-4`}>
                  Current Status:{" "}
                  <Text style={tw`font-medium`}>
                    {selectedAppointment.status}
                  </Text>
                </Text>
              </>
            )}

            {/* Show different buttons based on current status */}
            {selectedAppointment?.status === "pending" && (
              <View style={tw`flex-row justify-around mt-2`}>
                <TouchableOpacity
                  style={tw`bg-red-500 py-2 px-4 rounded`}
                  onPress={handleCancel}
                  disabled={isProcessing}>
                  <Text style={tw`text-white font-medium`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedAppointment?.status === "confirmed" && (
              <View style={tw`flex-row justify-around mt-2`}>
                <TouchableOpacity
                  style={tw`bg-red-500 py-2 px-4 rounded`}
                  onPress={handleCancel}
                  disabled={isProcessing}>
                  <Text style={tw`text-white font-medium`}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`bg-primary-500 py-2 px-4 rounded`}
                  onPress={handleMarkCompleted}
                  disabled={isProcessing}>
                  <Text style={tw`text-white font-medium`}>Complete</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={tw`mt-4 py-2 px-4 border border-gray-300 rounded`}
              onPress={() => setModalVisible(false)}
              disabled={isProcessing}>
              <Text style={tw`text-center`}>Close</Text>
            </TouchableOpacity>

            {isProcessing && (
              <View
                style={tw`absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center`}>
                <ActivityIndicator size="large" color="#4f46e5" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerDashboard;
