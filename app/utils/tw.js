// utils/tw.js
import { StyleSheet } from "react-native";
import originalTW from "tailwind-react-native-classnames";

// Custom colors mapping
const customColors = {
  "bg-primary": { backgroundColor: "#4b8494" },
  "bg-primary-dark": { backgroundColor: "#3a6a7a" },
  "text-primary": { color: "#4b8494" },
  "border-primary": { borderColor: "#4b8494" },
  // Add more custom colors as needed
};

// Create tagged template literal function
function tw(strings, ...values) {
  // Combine template strings and values
  const classString = strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || "");
  }, "");

  return createStyles(classString);
}

// Regular function for tw('classes')
tw.style = function (...classes) {
  return createStyles(classes.join(" "));
};

// Add direct color access
tw.colors = {
  primary: "#4b8494",
  primaryDark: "#3a6a7a",
};

// Helper function to create styles
function createStyles(classString) {
  const classes = classString.split(" ");
  const originalClasses = [];
  const customStyles = [];

  classes.forEach((cls) => {
    if (customColors[cls]) {
      customStyles.push(customColors[cls]);
    } else {
      originalClasses.push(cls);
    }
  });

  return StyleSheet.flatten([
    originalTW.style(originalClasses),
    ...customStyles,
  ]);
}

export default tw;
