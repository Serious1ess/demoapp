import React from "react";
import { LocaleProvider } from "./context/i18n";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  return (
    <UserProvider>
      <LocaleProvider>
        <AppNavigator />
      </LocaleProvider>
    </UserProvider>
  );
};

export default App;
