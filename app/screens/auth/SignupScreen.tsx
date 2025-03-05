import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { handleSignup } from "../../supabase/auth"; // Import handleSignup

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isBusiness, setIsBusiness] = useState(false); // Toggle for business account
  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false); // State to track email verification

  const onSignup = async () => {
    setLoading(true);
    await handleSignup(
      email,
      password,
      fullName,
      isBusiness,
      setWaitingForVerification,
      navigation
    );
    setLoading(false);
  };

  if (waitingForVerification) {
    return (
      <View style={styles.container}>
        <Text>Please verify your email to continue.</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Full Name Input */}
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        autoCapitalize="words"
      />

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />

      {/* Business Account Toggle */}
      <View style={styles.switchContainer}>
        <Text>Business Account</Text>
        <Switch value={isBusiness} onValueChange={setIsBusiness} />
      </View>

      {/* Sign Up Button */}
      <Button
        title={loading ? "Loading..." : "Sign Up"}
        onPress={onSignup}
        disabled={loading}
      />

      {/* Login Link */}
      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginVertical: 10 },
  link: { color: "blue", marginTop: 10 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default SignupScreen;
