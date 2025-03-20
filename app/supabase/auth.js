import { Alert } from "react-native";
import { supabase } from "./supabase"; // Import Supabase client

// Login function
export const handleLogin = async (email, password, setUser, navigation) => {
  if (!email || !password) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  try {
    // Step 1: Log in the user with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw authError;
    }

    // Step 2: Fetch the user's role from the `roles` table
    const { data: role, error: roleError } = await supabase
      .from("profiles")
      .select("is_business")
      .eq("id", authData.user.id) // Use the logged-in user's ID
      .single();

    if (roleError) {
      throw roleError;
    }

    // Step 3: Save the user's data to the context
    setUser({
      ...authData.user,
      isBusiness: role?.is_business || false, // Add the is_business flag
    });

    // Step 4: Navigate to the appropriate screen based on the role
    navigation.replace("HomeTabs"); // Navigate to the regular home screen
  } catch (error) {
    Alert.alert("Error", error.message || "An unexpected error occurred.");
  }
};

// Signup function
export const handleSignup = async (
  email,
  password,
  fullName,
  phone,
  idNumber,
  profilePicture,
  isBusiness,
  businessInfo,
  setWaitingForVerification,
  navigation
) => {
  if (!email || !password || !fullName || !phone || !idNumber) {
    Alert.alert("Error", "Please fill in all required fields.");
    return;
  }

  if (
    isBusiness &&
    (!businessInfo?.serviceType ||
      !businessInfo?.businessAddress ||
      !businessInfo?.businessDaysOpen?.length ||
      !businessInfo?.businessHours?.open ||
      !businessInfo?.businessHours?.close)
  ) {
    Alert.alert("Error", "Please fill in all business information fields.");
    return;
  }

  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // Add additional user metadata
        },
      },
    });

    if (authError) {
      throw authError;
    }

    // Step 2: Upload profile picture if provided
    let profilePictureUrl = null;
    if (profilePicture) {
      try {
        // Convert the profilePicture URI to a blob
        const response = await fetch(profilePicture);
        const blob = await response.blob();

        // Upload to Supabase Storage
        const fileExt = profilePicture.split(".").pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, blob);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
        } else {
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          profilePictureUrl = urlData?.publicUrl;
        }
      } catch (imageError) {
        console.error("Error processing image:", imageError);
      }
    }

    // Step 3: Insert the user's profile into the `profiles` table
    const profileData = {
      id: authData.user.id, // Link to the auth user
      full_name: fullName,
      phone: phone,
      id_number: idNumber,
      profile_picture: profilePictureUrl,
      is_business: isBusiness, // Set the business account flag
    };

    // Add business-specific fields if it's a business account
    if (isBusiness && businessInfo) {
      profileData.service_type = businessInfo.serviceType;
      profileData.business_address = businessInfo.businessAddress;
      profileData.business_days_open = businessInfo.businessDaysOpen;
      profileData.business_hours = businessInfo.businessHours;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([profileData]);

    if (profileError) {
      throw profileError;
    }

    // Step 3: Show a message to the user to verify their email
    setWaitingForVerification(true);
    Alert.alert(
      "Verify Your Email",
      "A verification link has been sent to your email. Please verify your email to continue.",
      [
        {
          text: "OK",
          onPress: () => {
            // Redirect to the login screen or stay on the signup screen
            navigation.replace("Login");
          },
        },
      ]
    );
  } catch (error) {
    Alert.alert("Error", error.message || "An unexpected error occurred.");
  }
};
// Fetch all business customers
export const fetchBusinessCustomers = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles") // Access the profiles table
      .select("id, full_name, phone") // Select the fields you need
      .eq("is_business", true); // Filter by business accounts

    if (error) {
      throw error;
    }

    return data; // Return the list of business customers
  } catch (error) {
    console.error("Error fetching business customers:", error.message);
    return [];
  }
};
