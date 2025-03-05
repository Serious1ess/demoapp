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
      .from("roles")
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
  isBusiness,
  setWaitingForVerification,
  navigation
) => {
  if (!email || !password || !fullName) {
    Alert.alert("Error", "Please fill in all fields.");
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

    // Step 2: Insert the user's role into the `roles` table
    const { error: roleError } = await supabase.from("roles").insert([
      {
        id: authData.user.id, // Link to the auth user
        is_business: isBusiness, // Set the business account flag
      },
    ]);

    if (roleError) {
      throw roleError;
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
