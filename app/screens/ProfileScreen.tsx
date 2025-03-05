import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import LanguageSelector from "../components/LanguageSelector"; // Import LanguageSelector

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Manage your account details here.</Text>

      {/* Add LanguageSelector here */}
      <LanguageSelector />

      <Button title="Logout" onPress={() => navigation.replace("Login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Added padding for better spacing
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ProfileScreen;
