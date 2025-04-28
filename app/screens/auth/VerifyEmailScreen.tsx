// screens/VerifyEmailScreen.tsx
import React from "react";
import { Button, Text, View } from "react-native";
import tw from "../../utils/tw";
const VerifyEmailScreen = ({ route, navigation }) => {
  const { email } = route.params;

  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Verify Your Email</Text>
      <Text style={tw`text-center mb-6`}>
        We've sent a verification link to {email}. Please check your email and
        verify your account.
      </Text>
      <Button
        title="Back to Login"
        onPress={() => navigation.replace("Login")}
      />
    </View>
  );
};

export default VerifyEmailScreen;
