import { Platform } from "react-native";
import { showAlert, supabase } from "./supabase";
import { uploadProfileImage } from "./utils/imageUploadUtils";

export const handleUpdateProfile = async (
  userData: {
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    birth_year: number,
  },
  userId: string,
  setUser: Function
) => {
  try {
    // Validate required fields
    if (!userData.first_name || !userData.last_name) {
      showAlert("Error", "First name, last name are required");
      return { success: false };
    }

    // Step 1: Upload profile picture if a new one is provided

    // Step 2: Update the profile in the database
    const profileData = {
      ...userData,
      profile_picture: profilePictureUrl,
      full_name: `${userData.first_name} ${userData.last_name}`,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId);

    if (error) {
      throw error;
    }

    // Step 4: Fetch the updated user profile to ensure we have the latest data
    const { data: freshProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Step 5: Update the user context with the fresh data
    setUser({
      ...authUser?.user,
      ...freshProfile,
      isBusiness: freshProfile?.is_business || false,
    });

    showAlert("Success", "Profile updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    showAlert(
      "Update Error",
      error.message || "Failed to update profile. Please try again."
    );
    return { success: false, error };
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

    // Step 2: Upload profile picture if provided with retry logic
    let profilePictureUrl = null;
    if (profilePicture) {
      // Add retry logic for image upload
      let uploadError = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(
            `Attempting to upload profile picture: attempt ${attempt + 1}`
          );

          // Add a longer timeout for image uploads (30 seconds)
          const uploadPromise = uploadProfileImage(
            authData.user.id,
            profilePicture
          );

          const imageTimeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Image upload timed out. Please try again with a smaller image."
                  )
                ),
              30000
            )
          );

          profilePictureUrl = await Promise.race([
            uploadPromise,
            imageTimeoutPromise,
          ]);

          // Verify the URL is valid before proceeding
          if (profilePictureUrl && typeof profilePictureUrl === "string") {
            // Ensure the URL is valid
            if (profilePictureUrl.startsWith("http")) {
              // Verify the image exists by trying to fetch it (for web)
              if (Platform.OS === "web") {
                try {
                  const checkImage = await fetch(profilePictureUrl, {
                    method: "HEAD",
                  });
                  if (!checkImage.ok) {
                    throw new Error(
                      `Image URL returned status ${checkImage.status}`
                    );
                  }
                } catch (fetchError) {
                  console.error("Image verification failed:", fetchError);
                  throw new Error("Uploaded image could not be verified");
                }
              }

              uploadError = null;
              console.log(
                `Profile picture uploaded successfully: ${profilePictureUrl}`
              );
              break;
            } else {
              throw new Error("Invalid profile picture URL returned");
            }
          } else {
            throw new Error("Profile picture upload failed");
          }
        } catch (error) {
          uploadError = error;
          console.error(`Image upload attempt ${attempt + 1} failed:`, error);

          // Wait before retry with exponential backoff
          if (attempt < 2) {
            const backoffTime = 1000 * Math.pow(2, attempt);
            console.log(`Waiting ${backoffTime}ms before next attempt`);
            await new Promise((resolve) => setTimeout(resolve, backoffTime));
          }
        }
      }

      if (uploadError) {
        console.error("All image upload attempts failed:", uploadError);
        showAlert(
          "Upload Warning",
          "Failed to upload profile picture after multiple attempts. Your account will be created without a profile picture."
        );
        // Continue with null profile picture
        profilePictureUrl = null;
      }
    }

    // Step 3: Create profile with retry logic
    let profileError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(
          `Attempting to create user profile: attempt ${attempt + 1}`
        );

        const { error, data } = await supabase
          .from("profiles")
          .insert({
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
          })
          .select();

        if (!error) {
          console.log("Profile created successfully:", data);
          profileError = null;
          break;
        }

        profileError = error;
        console.error(`Profile creation attempt ${attempt + 1} failed:`, error);
      } catch (error) {
        profileError = error;
        console.error(`Profile creation attempt ${attempt + 1} error:`, error);
      }

      if (attempt < 2) {
        const backoffTime = 1000 * Math.pow(2, attempt);
        console.log(
          `Waiting ${backoffTime}ms before next profile creation attempt`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
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
