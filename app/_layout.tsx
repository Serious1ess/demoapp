import React from "react";
import { LocaleProvider } from "./context/i18n";
import StyleWrapper from "./context/StyleWrapper";
import { UserProvider } from "./context/UserContext";
import AppNavigator from "./navigation/AppNavigator";
import "./styles/globle.css";

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
