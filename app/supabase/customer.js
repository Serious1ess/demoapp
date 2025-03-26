import { supabase } from "./supabase"; // Import Supabase client
export const fetchBusinessCustomers = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, services:services(id, service_type)")
      .eq("is_business", true); // Only fetch business customers

    if (error) {
      throw error;
    }

    return data; // List of business customers with their services
  } catch (error) {
    console.error("Error fetching business customers:", error.message);
    return [];
  }
};
