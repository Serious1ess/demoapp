import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase/supabase";

export const AuthService = {
  // Save session to AsyncStorage
  saveSession: async (session) => {
    try {
      await AsyncStorage.setItem("userSession", JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  },

  // Get session from AsyncStorage
  getSession: async () => {
    try {
      const session = await AsyncStorage.getItem("userSession");
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  },

  // Clear session from AsyncStorage
  clearSession: async () => {
    try {
      await AsyncStorage.removeItem("userSession");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  },

  // Check if user is logged in
  checkAuth: async () => {
    try {
      // First check AsyncStorage
      const savedSession = await AuthService.getSession();

      if (savedSession) {
        // Verify with Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          return session;
        }
      }
      return null;
    } catch (error) {
      console.error("Auth check error:", error);
      return null;
    }
  },
};
