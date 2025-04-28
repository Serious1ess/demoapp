// utils/tw.js
import { StyleSheet } from "react-native";
import originalTW from "tailwind-react-native-classnames";

// Custom colors mapping
const customColors = {
  "bg-primary": { backgroundColor: "#4b8494" },
  "bg-primary-dark": { backgroundColor: "#3a6a7a" },
  "text-primary": { color: "#4b8494" },
  "border-primary": { borderColor: "#4b8494" },
  "bg-primary-50": { backgroundColor: "#e0f2f8" },
  "border-primary-500": { borderColor: "#4b8494" },
  "text-primary-800": { color: "#2c3e50" },
  "bg-primary-100": { backgroundColor: "#cce7f1" },
  "bg-primary-200": { backgroundColor: "#99c4e0" },
  "bg-primary-300": { backgroundColor: "#66a1cf" },
  "bg-primary-400": { backgroundColor: "#3380be" },
  "bg-primary-500": { backgroundColor: "#4b8494" },
  "bg-primary-600": { backgroundColor: "#3a6a7a" },
  "bg-primary-700": { backgroundColor: "#2a4e5c" },
  "bg-primary-800": { backgroundColor: "#1a3340" },
  "bg-primary-900": { backgroundColor: "#0a1a20" },
  "text-primary-50": { color: "#e0f2f8" },
  "text-primary-100": { color: "#cce7f1" },
  "text-primary-200": { color: "#99c4e0" },
  "text-primary-300": { color: "#66a1cf" },
  "text-primary-400": { color: "#3380be" },
  "text-primary-500": { color: "#4b8494" },
  "text-primary-600": { color: "#3a6a7a" },
  "text-primary-700": { color: "#2a4e5c" },
  "text-primary-800": { color: "#1a3340" },
  "text-primary-900": { color: "#0a1a20" },
  "border-primary-50": { borderColor: "#e0f2f8" },
  "border-primary-100": { borderColor: "#cce7f1" },
  "border-primary-200": { borderColor: "#99c4e0" },
  "border-primary-300": { borderColor: "#66a1cf" },
  "border-primary-400": { borderColor: "#3380be" },
  "border-primary-500": { borderColor: "#4b8494" },
  "border-primary-600": { borderColor: "#3a6a7a" },
  "border-primary-700": { borderColor: "#2a4e5c" },
  "border-primary-800": { borderColor: "#1a3340" },
  "border-primary-900": { borderColor: "#0a1a20" },
  "bg-secondary": { backgroundColor: "#f0f0f0" },
  "text-secondary": { color: "#333" },
  "border-secondary": { borderColor: "#ccc" },
  "bg-secondary-50": { backgroundColor: "#f9f9f9" },
  "bg-secondary-100": { backgroundColor: "#f0f0f0" },
  "bg-secondary-200": { backgroundColor: "#e0e0e0" },
  "bg-secondary-300": { backgroundColor: "#d0d0d0" },
  "bg-secondary-400": { backgroundColor: "#c0c0c0" },
  "bg-secondary-500": { backgroundColor: "#b0b0b0" },
  "bg-secondary-600": { backgroundColor: "#a0a0a0" },
  "bg-secondary-700": { backgroundColor: "#909090" },
  "bg-secondary-800": { backgroundColor: "#808080" },
  "bg-secondary-900": { backgroundColor: "#707070" },
  "text-secondary-50": { color: "#f9f9f9" },
  "text-secondary-100": { color: "#f0f0f0" },
  "text-secondary-200": { color: "#e0e0e0" },
  "text-secondary-300": { color: "#d0d0d0" },
  "text-secondary-400": { color: "#c0c0c0" },
  "text-secondary-500": { color: "#b0b0b0" },
  "text-secondary-600": { color: "#a0a0a0" },
  "text-secondary-700": { color: "#909090" },
  "text-secondary-800": { color: "#808080" },
  "text-secondary-900": { color: "#707070" },
  "border-secondary-50": { borderColor: "#f9f9f9" },
  "border-secondary-100": { borderColor: "#f0f0f0" },
  "border-secondary-200": { borderColor: "#e0e0e0" },
  "border-secondary-300": { borderColor: "#d0d0d0" },
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
