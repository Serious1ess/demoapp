import { supabase } from "./supabase";
// Import Supabase client
export const fetchBusinessCustomers = async (options?: {
  limit?: number,
  searchQuery?: string,
}) => {
  try {
    let query = supabase.rpc("get_businesses_with_services", {
      search_query: options?.searchQuery,
      max_results: options?.limit,
    });

    const { data, error } = await query;

    if (error) throw error;
    console.log(data);
    return data || [];
  } catch (error) {
    console.error("Error fetching business customers:", error);
    // throw new Error(error.message || "Failed to fetch businesses");
  }
};
// for fetching user services

export const fetchUserServices = async (userId: string) => {
  try {
    // Fetch main service data along with related services list
    const { data, error } = await supabase
      .from("services")
      .select(
        `
          *,
          business_services (*)
        `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .single(); // Get most recent first

    if (error) throw error;
    let service = data;
    // Transform data for your UI
    return {
      id: service.id,
      service_type: service.service_type,
      business_address: service.business_address,
      business_days_open: service.business_days_open || [],
      business_hours: {
        open: service.opening_time,
        close: service.closing_time,
      },
      services_list:
        service.business_services?.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price.toString(),
          duration: item.duration_minutes, // Convert to string if needed
        })) || [],
      created_at: service.created_at,
    };
  } catch (error) {
    console.error("Error fetching user services:", error.message);
    return [];
  }
};

export const getCustomerAppointments = async () => {
  const { data, error } = await supabase
    .from("customer_appointments")
    .select("*");

  if (error) throw error;
  return data;
};
