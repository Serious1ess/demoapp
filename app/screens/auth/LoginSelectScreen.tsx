import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { LocaleContext } from "../../utils/lang/i18n";

const { height } = Dimensions.get("window");

const LoginSelectScreen = ({ navigation }) => {
  const intl = useIntl();
  const { switchLocale } = useContext(LocaleContext);

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Feather name="calendar" size={40} color="white" />
          </View>
        </View>

        <Text style={styles.mainTitle}>Service Hub</Text>
        <Text style={styles.subtitle}>
          {intl.formatMessage({ id: "selectAccount" })}
        </Text>
        <Text style={styles.description}>
          Connect with local services, book appointments instantly
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        {/* Sign In Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Login")}>
          <LinearGradient
            colors={["#5a67d8", "#4c51bf"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}>
            <View style={styles.buttonContent}>
              <Feather name="log-in" size={24} color="white" />
              <Text style={styles.primaryButtonText}>
                {intl.formatMessage({ id: "signIn" })}
              </Text>
              <Feather name="arrow-right" size={20} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Signup")}>
          <LinearGradient
            colors={["#f687b3", "#f093fb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.secondaryButton}>
            <View style={styles.buttonContent}>
              <Feather name="user-plus" size={24} color="white" />
              <Text style={styles.secondaryButtonText}>
                {intl.formatMessage({ id: "signUp" })}
              </Text>
              <Feather name="arrow-right" size={20} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Feather name="smartphone" size={20} color="#667eea" />
          </View>
          <Text style={styles.featureText}>Easy to Use</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Feather name="lock" size={20} color="#667eea" />
          </View>
          <Text style={styles.featureText}>Secure</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Feather name="globe" size={20} color="#667eea" />
          </View>
          <Text style={styles.featureText}>Global</Text>
        </View>
      </View>

      {/* Language Switcher */}
      <View style={styles.languageContainer}>
        <LanguageSelector />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "space-between",
  },

  headerSection: {
    alignItems: "center",
    marginTop: 20,
  },

  logoContainer: {
    marginBottom: 30,
  },

  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  mainTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontWeight: "500",
  },

  buttonSection: {
    gap: 16,
    marginVertical: 30,
  },

  primaryButton: {
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  secondaryButton: {
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  secondaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  featureItem: {
    alignItems: "center",
    gap: 8,
  },

  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  featureText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },

  languageContainer: {
    marginBottom: 10,
  },
});

export default LoginSelectScreen;
