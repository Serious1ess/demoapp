import React from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useUser } from "../../context/UserContext";
const BusinessHome = () => {
  const { user } = useUser();
  const fullname = user.user_metadata.full_name;

  // Get current date without time for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text>{fullname}</Text>
      <Text>Your appointments will be shown here.</Text>
    </View>
  );
};

export default BusinessHome;
