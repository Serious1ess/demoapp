import React from "react";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./navigation/AppNavigator"; // Updated import path
import { LocaleProvider } from "./utils/lang/i18n";
import StyleWrapper from "./utils/style/StyleWrapper";

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
