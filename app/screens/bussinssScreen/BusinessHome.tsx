import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUser } from "../../context/UserContext"; // Import useUser
const BusinessHome = () => {
  const { user } = useUser(); // Access user data from context

  const fullname = user.user_metadata.full_name;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fullname}</Text>
      <Text>Your appointments will be shown here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default BusinessHome;
