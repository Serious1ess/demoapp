import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { handleLogin } from "../../supabase/auth";

const LoginScreen = ({ navigation }) => {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();

  const onLogin = async () => {
    setLoading(true);
    await handleLogin(email, password, setUser, navigation);
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginSelect")}
              style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoBadge}>
                <Feather name="log-in" size={40} color="white" />
              </View>
            </View>

            <Text style={styles.mainTitle}>
              {intl.formatMessage({ id: "appName" })}
            </Text>
            <Text style={styles.subtitle}>
              {intl.formatMessage({ id: "loginSubtitle" })}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Feather name="mail" size={16} color="#667eea" />
                <Text style={styles.labelText}>
                  {intl.formatMessage({ id: "EML" })}
                </Text>
              </View>
              <TextInput
                placeholder={intl.formatMessage({ id: "EML" })}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Feather name="lock" size={16} color="#667eea" />
                <Text style={styles.labelText}>
                  {intl.formatMessage({ id: "PSSWRD" })}
                </Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder={intl.formatMessage({ id: "PSSWRD" })}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  autoCapitalize="none"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}>
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>
                {intl.formatMessage({ id: "forgotPassword" }) ||
                  "Forgot Password?"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onLogin}
              disabled={loading || !email || !password}>
              <LinearGradient
                colors={["#5a67d8", "#4c51bf"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.loginButton,
                  (loading || !email || !password) && styles.buttonDisabled,
                ]}>
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator color="white" size="large" />
                  ) : (
                    <>
                      <Feather name="log-in" size={20} color="white" />
                      <Text style={styles.loginButtonText}>
                        {intl.formatMessage({ id: "signIn" })}
                      </Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              {intl.formatMessage({ id: "DNTHVANACCNT" })}{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupLink}>
                {intl.formatMessage({ id: "signUp" })}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },

  logoContainer: {
    marginBottom: 24,
  },

  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "500",
  },

  formSection: {
    marginBottom: 30,
    gap: 20,
  },

  inputGroup: {
    gap: 10,
  },

  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  labelText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  togglePassword: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  forgotContainer: {
    alignItems: "flex-end",
  },

  forgotText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  buttonSection: {
    marginBottom: 30,
  },

  loginButton: {
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },

  signupText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },

  signupLink: {
    color: "#ffed4e",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
