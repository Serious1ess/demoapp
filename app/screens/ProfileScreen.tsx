import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Icon
import LanguageSelector from "../components/LanguageSelector";
import { useUser } from "../context/UserContext"; // Custom hook to get user data

const ProfileScreen = ({ navigation }) => {
  const { user } = useUser(); // Get user data

  return (
    <View style={styles.container}>
      {/* Profile Image or Default Icon */}
      {user?.profile_img ? (
        <Image source={{ uri: user.profile_img }} style={styles.profileImage} />
      ) : (
        <Ionicons name="person-circle-outline" size={100} color="#888" />
      )}
      <Text style={styles.userName}>
        {user?.user_metadata?.full_name || "User"}
      </Text>
      <Text style={styles.userPhone}>{user?.phone || "No phone number"}</Text>

      <LanguageSelector />

      {user?.isBusiness && (
        <Button
          title="Service"
          onPress={() => navigation.navigate("ServiceScreen")}
        />
      )}

      <Button title="Logout" onPress={() => navigation.replace("Login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userPhone: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
});

export default ProfileScreen;
