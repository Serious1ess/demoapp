// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wxqqysebnhrigkdhgqbw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cXF5c2VibmhyaWdrZGhncWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMDE0NDcsImV4cCI6MjA1Njc3NzQ0N30.ipIe8plq1x7Edv8JF8qmwS61r3yZj8ke0VJ4fF2UPXg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
// Helper function to show alerts consistently across platforms
export const showAlert = (title: string, message: string) => {
  if (typeof window !== "undefined" && window.alert) {
    // Web environment
    window.alert(`${title}\n\n${message}`);
  } else {
    // React Native environment
    Alert.alert(title, message);
  }
};
