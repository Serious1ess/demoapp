import React, { useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { handleLogin } from "../../supabase/auth";
import tw from "../../utils/tw";

const LoginScreen = ({ navigation }) => {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const onLogin = async () => {
    setLoading(true);
    await handleLogin(email, password, setUser, navigation);
    setLoading(false);
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-5`}>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("LoginSelect")}
        style={tw`p-2 ${intl.locale === "ar" ? "ml-4" : "mr-4"}`}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#4b8494"
          style={{ transform: [{ scaleX: intl.locale === "ar" ? -1 : 1 }] }}
        />
      </TouchableOpacity> */}
      <Text style={tw`text-3xl font-bold mb-2 text-gray-800`}>
        {intl.formatMessage({ id: "appName" })}
      </Text>
      <Text style={tw`text-base mb-8 text-gray-600`}>
        {intl.formatMessage({ id: "loginSubtitle" })}
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder={intl.formatMessage({ id: "EML" })}
        value={email}
        onChangeText={setEmail}
        style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 bg-white text-gray-800`}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      {/* Password Input */}
      <TextInput
        placeholder={intl.formatMessage({ id: "PSSWRD" })}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`w-full p-4 border border-gray-300 rounded-lg mb-4 bg-white text-gray-800`}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      {/* Login Button */}
      <TouchableOpacity
        style={tw`w-full p-4 bg-primary rounded-lg mb-6 items-center`}
        onPress={onLogin}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white font-bold text-lg`}>
            {intl.formatMessage({ id: "signIn" })}
          </Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={tw`text-gray-600`}>
          {intl.formatMessage({ id: "DNTHVANACCNT" })}{" "}
          <Text style={tw`font-bold text-primary`}>
            {intl.formatMessage({ id: "signUp" })}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
