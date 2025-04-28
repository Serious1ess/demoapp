import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { LocaleContext } from "../context/i18n";
import tw from "../utils/tw";
const LanguageSelector = () => {
  const intl = useIntl();
  const { locale, switchLocale } = useContext(LocaleContext);
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    { label: "🇺🇸 English", value: "en" },
    { label: "🇦🇪 العربية", value: "ar" },
  ];

  // RTL direction based on locale
  const rtlStyle =
    locale === "ar" ? { direction: "rtl" } : { direction: "ltr" };

  return (
    <View style={[tw`my-5`, rtlStyle]}>
      {/* Button to open the modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`px-4 py-2 rounded bg-white border border-gray-300 items-center`}>
        <Text style={tw`text-gray-800 text-base`}>
          {languages.find((lang) => lang.value === locale)?.label ||
            intl.formatMessage({ id: "selectLanguage" })}
        </Text>
      </TouchableOpacity>

      {/* Modal for language selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[tw`w-4/5 bg-white rounded-lg p-5`, rtlStyle]}>
            <Text style={tw`text-lg font-bold mb-4 text-center text-gray-800`}>
              {intl.formatMessage({ id: "selectLanguage" })}
            </Text>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => {
                  switchLocale(lang.value);
                  setModalVisible(false);
                }}
                style={tw`py-4 border-b border-gray-200`}>
                <Text style={tw`text-base text-gray-800`}>{lang.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`mt-5 py-2 bg-gray-300 rounded items-center`}>
              <Text style={tw`text-base text-gray-800`}>
                {intl.formatMessage({ id: "close" })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LanguageSelector;
