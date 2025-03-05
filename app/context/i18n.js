import React, { createContext, useState } from "react";
import { IntlProvider } from "react-intl";
import ar from "../locales/ar.json";
import en from "../locales/en.json";

const messages = { en, ar };
export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

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
