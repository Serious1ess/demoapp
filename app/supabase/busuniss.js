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

    // Enhanced service validation
    businessInfo.servicesList.forEach((service: any) => {
      if (!service.id) service.id = crypto.randomUUID(); // Generate ID if missing
      if (!service.duration || isNaN(parseInt(service.duration))) {
        throw new Error(`Invalid duration for service: ${service.name}`);
      }
      if (!service.price || isNaN(parseFloat(service.price))) {
        throw new Error(`Invalid price for service: ${service.name}`);
      }
    });

    // Time formatting helper
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

    // Start a transaction
    const { data, error } = await supabase.rpc("save_business_services", {
      user_id: userId,
      service_type: businessInfo.serviceType,
      business_address: businessInfo.businessAddress,
      business_days: businessInfo.businessDaysOpen,
      opening_time: formatTimeForPostgres(businessInfo.businessHours.open),
      closing_time: formatTimeForPostgres(businessInfo.businessHours.close),
      services: businessInfo.servicesList.map((s: any) => ({
        id: s.id,
        name: s.name,
        price: parseFloat(s.price),
        duration: parseInt(s.duration),
      })),
    });

    if (error) throw error;

    return {
      serviceId: data.service_id,
      servicesCount: data.services_count,
      isUpdate: data.is_update,
      timestamp: currentTime,
    };
  } catch (error) {
    console.error("Error saving business data:", error);
    throw new Error(error.message || "Failed to save business data");
  }
};

export const fetchUserServices = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        id,
        user_id,
        service_type,
        business_address,
        business_days_open,
        opening_time,
        closing_time,
        created_at,
        updated_at,
        business_services:business_services(
          id,
          name,
          price,
          duration_minutes,
          created_at
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1); // Get only the most recent service profile

    if (error) throw error;

    if (!data || data.length === 0) return null;

    const serviceData = data[0];

    return {
      id: serviceData.id,
      service_type: serviceData.service_type,
      business_address: serviceData.business_address,
      business_days_open: serviceData.business_days_open || [],
      business_hours: {
        open: serviceData.opening_time,
        close: serviceData.closing_time,
      },
      services_list: serviceData.business_services.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price.toFixed(2), // Format price as string with 2 decimals
        duration: service.duration_minutes,
        created_at: service.created_at,
      })),
      created_at: serviceData.created_at,
      updated_at: serviceData.updated_at,
    };
  } catch (error) {
    console.error("Error fetching user services:", error.message);
    return null;
  }
};

export const createAppointment = async (
  businessId: string,
  date: string,
  time: string,
  serviceIds: string[],
  clientId?: string // Make optional for backward compatibility
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("create_appointment", {
    _business_id: businessId, // Business ID
    _customer_id: clientId || session.user.id, // Fallback to session user
    _date: date,
    _service_ids: serviceIds,
    _time: time,
  });

  if (error) throw error;
  return data;
};
export const getBusinessAppointments = async () => {
  const { data, error } = await supabase
    .from("business_appointments")
    .select("*");

  if (error) throw error;
  return data;
};

export const getAppointmentServices = async (appointmentId) => {
  const { data, error } = await supabase
    .from("appointment_services")
    .select("service_id, service_name")
    .eq("appointment_id", appointmentId);

  if (error) throw error;
  return data;
};
