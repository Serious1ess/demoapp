import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LanguageSelector from "../../components/LanguageSelector";
import { LocaleContext } from "../../context/i18n";

const LoginSelectScreen = ({ navigation }) => {
  const intl = useIntl();
  const { switchLocale } = useContext(LocaleContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {intl.formatMessage({ id: "selectAccount" })}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>
          {intl.formatMessage({ id: "signIn" })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeTabs")}>
        <Text style={styles.buttonText}>
          {intl.formatMessage({ id: "continueWithoutSignIn" })}
        </Text>
      </TouchableOpacity>

      {/* Language Switcher */}
      <LanguageSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  languageButton: {
    width: "80%",
    padding: 10,
    backgroundColor: "#28a745",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
});

export default LoginSelectScreen;
