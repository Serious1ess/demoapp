import React, { createContext, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { I18nManager } from "react-native";
import ar from "../locales/ar.json";
import en from "../locales/en.json";

const messages = { en, ar };
export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    // Force RTL when Arabic is selected
    if (locale === "ar") {
      I18nManager.forceRTL(true);
      require("../styles/globle_rtl.css"); // Load RTL styles
    } else {
      I18nManager.forceRTL(false);
      require("../styles/globle.css"); // Load LTR styles
    }
  }, [locale]);

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
