import { Alert, Platform } from "react-native";
import { supabase } from "./supabase";
import { uploadProfileImage } from "./utils/imageUploadUtils";

// Helper function to show alerts consistently across platforms
const showAlert = (title: string, message: string) => {
  if (typeof window !== "undefined" && window.alert) {
    // Web environment
    window.alert(`${title}\n\n${message}`);
  } else {
    // React Native environment
    Alert.alert(title, message);
  }
};

export const handleLogin = async (
  email: string,
  password: string,
  setUser: Function,
  navigation: any
) => {
  if (!email || !password) {
    showAlert("Error", "Please fill in all fields.");
    return;
  }

  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    // Step 1: Log in the user with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      // Handle specific auth errors
      if (authError.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password");
      }
      throw authError;
    }

    // Step 2: Fetch the user's complete profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw new Error("Could not load your profile data");
    }

    // Step 3: Save the complete user data to context
    setUser({
      ...authData.user,
      ...profile,
      isBusiness: profile?.is_business || false,
    });

    // Step 4: Navigate to home
    navigation.replace("MainApp");
  } catch (error) {
    console.error("Login error:", error);
    showAlert(
      "Login Error",
      error.message || "An unexpected error occurred. Please try again."
    );
  }
};

export const handleSignup = async (
  email: string,
  password: string,
  name: string,
  surname: string,
  phone: string,
  idNumber: string,
  profilePicture: string | null,
  birthYear: string,
  setWaitingForVerification: (value: boolean) => void,
  isBusiness: boolean,
  navigation: any
) => {
  // Validate all required fields
  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!name) missingFields.push("name");
  if (!surname) missingFields.push("surname");
  if (!phone) missingFields.push("phone");
  if (!idNumber) missingFields.push("ID number");
  if (!birthYear) missingFields.push("birth year");

  if (missingFields.length > 0) {
    showAlert(
      "Error",
      `Please fill in all required fields: ${missingFields.join(", ")}`
    );
    return;
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAlert("Error", "Please enter a valid email address");
    return;
  }

  // Validate password strength
  if (password.length < 8) {
    showAlert("Error", "Password must be at least 8 characters long");
    return;
  }

  try {
    // Step 1: Sign up the user with timeout
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${name} ${surname}`,
          first_name: name,
          last_name: surname,
        },
        // ONLY add redirect for web
        ...(Platform.OS === "web" && {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }),
      },
    });

    // Add timeout to prevent hanging (15 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Signup timed out. Please try again.")),
        15000
      )
    );

    const { data: authData, error: authError } = await Promise.race([
      signUpPromise,
      timeoutPromise,
    ]);

    if (authError) {
      // Handle specific signup errors
      if (authError.message.includes("already registered")) {
        throw new Error(
          "This email is already registered. Please login instead."
        );
      }
      throw authError;
    }

    if (!authData?.user) {
      throw new Error("User creation failed. Please try again.");
    }

    // Step 2: Upload profile picture if provided
    let profilePictureUrl = null;
    if (profilePicture) {
      try {
        profilePictureUrl = await uploadProfileImage(
          authData.user.id,
          profilePicture
        );
      } catch (error) {
        console.error("Image upload error:", error);
        showAlert(
          "Upload Error",
          error.message ||
            "Failed to upload profile picture. You can add one later."
        );
      }
    }

    // Step 3: Create profile with retry logic
    let profileError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { error } = await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: `${name} ${surname}`,
          first_name: name,
          last_name: surname,
          phone,
          id_number: idNumber,
          profile_picture: profilePictureUrl,
          birth_year: parseInt(birthYear),
          country: "Turkey",
          is_business: isBusiness,
        });

        if (!error) {
          profileError = null;
          break;
        }
        profileError = error;
      } catch (error) {
        profileError = error;
      }

      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    if (profileError) {
      throw profileError;
    }

    // Step 4: Show success
    setWaitingForVerification(true);
    navigation.replace("VerifyEmail", { email });
  } catch (error) {
    console.error("Signup error:", error);
    showAlert(
      "Signup Error",
      error.message || "Signup failed. Please try again."
    );

    // Clean up if possible
    try {
      if (supabase.auth.getSession()) {
        await supabase.auth.signOut();
      }
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
};

export const handleLogout = async (setUser: Function, navigation: any) => {
  try {
    await supabase.auth.signOut();
    setUser(null);
    navigation.replace("Login");
  } catch (error) {
    console.error("Error logging out:", error);
    showAlert("Logout Error", "Failed to logout. Please try again.");
  }
};
