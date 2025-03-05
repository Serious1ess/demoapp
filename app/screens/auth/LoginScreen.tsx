import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../../context/UserContext"; // Import useUser
import { handleLogin } from "../../supabase/auth"; // Import handleLogin

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser(); // Access setUser from UserContext

  const onLogin = async () => {
    setLoading(true);
    await handleLogin(email, password, setUser, navigation);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      {/* Login Button */}
      <Button
        title={loading ? "Loading..." : "Login"}
        onPress={onLogin}
        disabled={loading}
      />

      {/* Sign Up Link */}
      <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginVertical: 10 },
  link: { color: "blue", marginTop: 10 },
});

export default LoginScreen;
