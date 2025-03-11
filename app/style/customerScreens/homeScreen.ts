import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "web" ? 24 : 16,
  },
  modal: {
    margin: Platform.OS === "web" ? 20 : 0,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: Platform.OS === "web" ? 24 : 16,
    borderRadius: 12,
    width: Platform.OS === "web" ? "50%" : "92%",
    maxHeight: Platform.OS === "web" ? "90%" : "80%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow:
          "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
      },
    }),
  },
  dateSelectionModalContent: {
    backgroundColor: "#fff",
    padding: Platform.OS === "web" ? 24 : 16,
    borderRadius: 12,
    width: Platform.OS === "web" ? "60%" : "95%",
    maxHeight: Platform.OS === "web" ? "90%" : "85%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow:
          "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
      },
    }),
  },
  modalTitle: {
    fontSize: Platform.OS === "web" ? 24 : 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: Platform.OS === "web" ? 18 : 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.OS === "web" ? 20 : 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  servicesContainer: {
    maxHeight: 250,
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  selectedServiceItem: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 16,
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c5460",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: Platform.OS === "web" ? 8 : 0,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#0c5460",
    backgroundColor: "#d1ecf1",
    padding: 10,
    borderRadius: 8,
  },
  timeSlotsContainer: {
    marginTop: 16,
    marginBottom: 16,
    maxHeight: 300, // Add a max height to prevent the container from being too tall
  },
  timeSlotTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: Platform.OS === "web" ? -5 : 0,
    maxHeight: 220, // Limit the height to prevent excessive scrolling
  },
  timeSlot: {
    padding: 10,
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: Platform.OS === "web" ? "22%" : "30%",
    marginBottom: 8,
  },
  availableSlot: {
    backgroundColor: "#d4edda", // Green for available slots
    borderColor: "#c3e6cb",
    borderWidth: 1,
  },
  busySlot: {
    backgroundColor: "#f8d7da", // Red for busy slots
    borderColor: "#f5c6cb",
    borderWidth: 1,
    opacity: 0.7,
  },
  selectedSlot: {
    backgroundColor: "#cce5ff", // Blue for selected slot
    borderColor: "#b8daff",
    borderWidth: 2,
  },
  timeSlotText: {
    fontWeight: "500",
  },
  selectedTimeText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    backgroundColor: "#cce5ff",
    padding: 10,
    borderRadius: 8,
    color: "#004085",
  },
  datePickerContainer: {
    ...Platform.select({
      web: {
        position: "relative",
        zIndex: 1000,
      },
      default: {
        flex: 1,
      },
    }),
    marginVertical: 16,
  },
  datePickerButton: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1890ff",
    flexDirection: "row",
    justifyContent: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0c5460",
  },
  dateSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
});
