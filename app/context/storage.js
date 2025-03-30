// import { Platform } from "react-native";

// let AsyncStorage;

// if (Platform.OS === "web") {
//   AsyncStorage = {
//     getItem: async (key) => {
//       try {
//         return localStorage.getItem(key);
//       } catch (e) {
//         console.error("localStorage error:", e);
//         return null;
//       }
//     },
//     setItem: async (key, value) => {
//       try {
//         localStorage.setItem(key, value);
//       } catch (e) {
//         console.error("localStorage error:", e);
//       }
//     },
//     removeItem: async (key) => {
//       try {
//         localStorage.removeItem(key);
//       } catch (e) {
//         console.error("localStorage error:", e);
//       }
//     },
//   };
// } else {
//   // Use the current recommended package for native
//   AsyncStorage = require("@react-native-async-storage/async-storage").default;
// }

// export default AsyncStorage;
