import { supabase } from "./supabase"; // Import Supabase client

// Save user service data
export const saveUserServiceData = async (
  userId: string,
  businessInfo: any
) => {
  if (!userId || !businessInfo) {
    throw new Error("Missing userId or businessInfo");
  }

  try {
    // Validate required fields
    if (
      !businessInfo.serviceType ||
      !businessInfo.businessAddress ||
      !businessInfo.businessDaysOpen?.length ||
      !businessInfo.businessHours?.open ||
      !businessInfo.businessHours?.close ||
      !businessInfo.servicesList?.length
    ) {
      throw new Error("Missing required business information");
    }

    // Convert time to proper PostgreSQL time format
    const formatTimeForPostgres = (timeStr: string) => {
      if (!timeStr) return null;

      // Handle both "9:30 AM" and "09:30:00" formats
      let time = timeStr;
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const date = new Date(`1970-01-01 ${timeStr}`);
        time = date.toTimeString().split(" ")[0];
      }

      // Ensure proper HH:MM:SS format
      const [hours, minutes, seconds] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${
        seconds || "00"
      }`;
    };

    const currentTime = new Date().toISOString();

    // 1. Check for existing service
    const { data: existingServices, error: fetchError } = await supabase
      .from("services")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    let serviceId: string;
    const isUpdate = existingServices && existingServices.length > 0;

    // 2A. Update existing record
    if (isUpdate) {
      serviceId = existingServices[0].id;

      // Update main service record
      const { error: updateError } = await supabase
        .from("services")
        .update({
          service_type: businessInfo.serviceType,
          business_address: businessInfo.businessAddress,
          business_days_open: businessInfo.businessDaysOpen,
          opening_time: formatTimeForPostgres(businessInfo.businessHours.open),
          closing_time: formatTimeForPostgres(businessInfo.businessHours.close),
          updated_at: currentTime, // Explicitly set (trigger will also set this)
        })
        .eq("id", serviceId);

      if (updateError) throw updateError;

      // Delete existing business_services
      const { error: deleteError } = await supabase
        .from("business_services")
        .delete()
        .eq("service_id", serviceId);

      if (deleteError) throw deleteError;
    }
    // 2B. Create new record
    else {
      const { data: newService, error: insertError } = await supabase
        .from("services")
        .insert({
          user_id: userId,
          service_type: businessInfo.serviceType,
          business_address: businessInfo.businessAddress,
          business_days_open: businessInfo.businessDaysOpen,
          opening_time: formatTimeForPostgres(businessInfo.businessHours.open),
          closing_time: formatTimeForPostgres(businessInfo.businessHours.close),
          created_at: currentTime,
          updated_at: currentTime,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      serviceId = newService.id;
    }

    // 3. Insert business_services with timestamps
    const servicesToInsert = businessInfo.servicesList.map((service: any) => ({
      service_id: serviceId,
      name: service.name,
      price: parseFloat(
        parseFloat(service.price.replace(/[^0-9.]/g, "")).toFixed(2)
      ),
      created_at: currentTime,
      updated_at: currentTime,
    }));

    const { error: servicesError } = await supabase
      .from("business_services")
      .insert(servicesToInsert);

    if (servicesError) throw servicesError;

    return {
      serviceId,
      servicesCount: servicesToInsert.length,
      isUpdate,
      timestamp: currentTime,
    };
  } catch (error) {
    console.log("Detailed error saving business data:", error);
    throw new Error(error.message || "Failed to save business data");
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
      .order("created_at", { ascending: false }); // Get most recent first

    if (error) throw error;

    // Transform data for your UI
    return data.map((service) => ({
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
          price: item.price.toString(), // Convert to string if needed
        })) || [],
      created_at: service.created_at,
    }));
  } catch (error) {
    console.error("Error fetching user services:", error.message);
    return [];
  }
};
