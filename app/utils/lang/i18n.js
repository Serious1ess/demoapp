import React, { createContext, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { I18nManager } from "react-native";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const messages = { en, ar };
export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    // Force RTL when Arabic is selected
    if (locale === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }, [locale]);

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
  };

  // Custom error handler for missing translations
  const handleIntlError = (error) => {
    if (error.code === "MISSING_TRANSLATION") {
      // Return undefined to fall back to the message ID
      return;
    }
    console.error(error);
  };

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        onError={handleIntlError}
        defaultLocale="en"
        textComponent={React.Fragment} // Prevents extra wrapper spans
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
