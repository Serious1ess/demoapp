import React from "react";
import { LocaleProvider } from "./context/i18n";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./navigation/AppNavigator";
import StyleWrapper from "./context/StyleWrapper";

const App = () => {
  return (
    <UserProvider>
      <LocaleProvider>
        <StyleWrapper>
          <AppNavigator />
        </StyleWrapper>
      </LocaleProvider>
    </UserProvider>
  );
};

export default App;
