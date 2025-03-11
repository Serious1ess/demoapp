import { Dimensions, Platform, StyleSheet } from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Define breakpoints for responsive design
const isSmallDevice = width < 375;
const isTablet = width > 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.select({
      ios: isSmallDevice ? 12 : 16,
      android: 16,
      web: isTablet ? 32 : 24,
    }),
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        paddingTop: 50, // Account for iOS status bar
      },
      android: {
        paddingTop: 16,
      },
      web: {
        maxWidth: isTablet ? 1024 : "100%",
        alignSelf: "center",
      },
    }),
  },
  headerTitle: {
    fontSize: Platform.select({
      ios: 22,
      android: 20,
      web: isTablet ? 32 : 24,
    }),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: isSmallDevice ? 12 : 16,
    color: "#333",
    ...Platform.select({
      ios: {
        fontFamily: "System",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  customerInfo: {
    backgroundColor: "#f0f8ff",
    padding: isSmallDevice ? 12 : 16,
    borderRadius: 8,
    marginBottom: isSmallDevice ? 16 : 24,
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
  customerName: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#555",
  },
  servicesSummary: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.select({
      ios: isSmallDevice ? 16 : 18,
      android: 18,
      web: isTablet ? 22 : 20,
    }),
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  selectedServicesContainer: {
    maxHeight: height * 0.2, // 20% of screen height
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      },
    }),
  },
  selectedServiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  serviceName: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#333",
  },
  servicePrice: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "600",
    color: "#0c5460",
  },
  dateSelectorTitle: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: Platform.OS === "web" ? "center" : "left",
  },
  datePickerContainer: {
    marginVertical: 16,
    ...Platform.select({
      web: {
        position: "relative",
        zIndex: 1000,
      },
    }),
  },
  datePickerButton: {
    backgroundColor: "#e6f7ff",
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1890ff",
    flexDirection: "row",
    justifyContent: "center",
  },
  datePickerButtonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "500",
    color: "#0c5460",
  },
  selectedDate: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
    color: "#0c5460",
    backgroundColor: "#d1ecf1",
    padding: 10,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#aaa",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
    }),
  },
  timeSlotsContainer: {
    marginTop: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 12 : 16,
    maxHeight: Platform.OS === "web" ? height * 0.35 : height * 0.3, // Different height for web vs mobile
  },
  timeSlotTitle: {
    fontSize: isSmallDevice ? 16 : 18,
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
    maxHeight: isTablet ? height * 0.3 : height * 0.25,
  },
  timeSlot: {
    padding: isSmallDevice ? 8 : 10,
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: Platform.select({
      ios: isSmallDevice ? "30%" : "31%",
      android: "30%",
      web: isTablet ? "22%" : "30%",
    }),
    marginBottom: 8,
  },
  timeSlotText: {
    fontWeight: "500",
    fontSize: isSmallDevice ? 13 : 15,
  },
  availableSlot: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    borderWidth: 1,
  },
  busySlot: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    opacity: 0.7,
  },
  selectedSlot: {
    backgroundColor: "#cce5ff",
    borderColor: "#b8daff",
    borderWidth: 2,
  },
  selectedTimeText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: isSmallDevice ? 8 : 12,
    backgroundColor: "#cce5ff",
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 8,
    color: "#004085",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Push to bottom
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 0, // Extra padding for iOS
  },
  button: {
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 16 : 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nextButton: {
    backgroundColor: "#007BFF",
    ...Platform.select({
      ios: {
        shadowColor: "#007BFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0,123,255,0.3)",
      },
    }),
  },
  buttonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "600",
    color: Platform.select({
      ios: "#333",
      android: "#333",
      web: "#333",
    }),
  },
});
