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
  appointmentCard: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      },
    }),
  },
  customerInfo: {
    backgroundColor: "#f8f9fa",
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
  appointmentDetail: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "500",
    color: "#555",
    width: isTablet ? 150 : 100,
  },
  detailValue: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  servicesSummary: {
    marginVertical: 20,
  },
  servicesList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: isSmallDevice ? 12 : 16,
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
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
    }),
    maxHeight: height * 0.25, // Limit height to 25% of screen
  },
  serviceItem: {
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
  appointmentDateCard: {
    backgroundColor: "#e6f7ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
  appointmentDate: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    color: "#0c5460",
    textAlign: "center",
  },
  appointmentTime: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    color: "#0c5460",
    textAlign: "center",
    marginTop: 4,
  },
  totalContainer: {
    backgroundColor: "#d1ecf1",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    color: "#0c5460",
  },
  totalAmount: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "bold",
    color: "#0c5460",
  },
  confirmButtonContainer: {
    marginTop: "auto", // Push to bottom
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 0, // Extra padding for iOS
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: isSmallDevice ? 12 : 16,
    borderRadius: 8,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#28a745",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 4px rgba(40,167,69,0.3)",
      },
    }),
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
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
  nextButtonText: {
    color: "#fff",
  },
});
