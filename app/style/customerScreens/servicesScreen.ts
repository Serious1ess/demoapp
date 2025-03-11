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
  servicesContainer: {
    maxHeight: height * 0.4, // 40% of screen height
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: isSmallDevice ? 6 : 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
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
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 1,
  },
  serviceName: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#333",
    flex: 2, // Take more space for the name
  },
  servicePrice: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "600",
    color: "#0c5460",
    flex: 1,
    textAlign: "right",
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
