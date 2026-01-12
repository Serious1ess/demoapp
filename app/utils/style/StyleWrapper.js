import React, { useContext } from "react";
import { View } from "react-native";
import { LocaleContext } from "../lang/i18n";

const StyleWrapper = ({ children }) => {
  const { locale } = useContext(LocaleContext);

  return (
    <View
      style={{
        flex: 1,
        writingDirection: locale === "ar" ? "rtl" : "ltr",
      }}>
      {children}
    </View>
  );
};

export default StyleWrapper;
