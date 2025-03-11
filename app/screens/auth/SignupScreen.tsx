import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { handleSignup } from "../../supabase/auth"; // Import handleSignup

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(""); // State for phone number
  const [isBusiness, setIsBusiness] = useState(false); // Toggle for business account
  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false); // State to track email verification

  const onSignup = async () => {
    setLoading(true);
    await handleSignup(
      email,
      password,
      fullName,
      phone, // Pass phone number
      isBusiness,
      setWaitingForVerification,
      navigation
    );
    setLoading(false);
  };

  if (waitingForVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationText}>
          Please verify your email to continue.
        </Text>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join us to get started</Text>

        {/* Full Name Input */}
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        {/* Phone Number Input */}
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        {/* Business Account Toggle */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Business Account</Text>
          <Switch
            value={isBusiness}
            onValueChange={setIsBusiness}
            trackColor={{ false: "#ccc", true: "#007bff" }}
            thumbColor={isBusiness ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onSignup}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  verificationText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  switchText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  linkBold: {
    fontWeight: "bold",
    color: "#007bff",
  },
});

export default SignupScreen;
