import { Alert } from "react-native";
import { supabase } from "./supabase";
import { getFileInfo, readFile } from "./utils/fileUtils";

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

    if (authError) throw authError;

    // Step 2: Fetch the user's complete profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) throw profileError;

    // Step 3: Save the complete user data to context
    setUser({
      ...authData.user,
      ...profile, // Include all profile fields
      isBusiness: profile?.is_business || false,
    });

    // Step 4: Navigate to home
    navigation.replace("HomeTabs");
  } catch (error) {
    Alert.alert("Error", error.message || "An unexpected error occurred.");
  }
};

export const handleSignup = async (
  email: string,
  password: string,
  name: string, // Changed from firstName
  surname: string, // Changed from lastName
  phone: string,
  idNumber: string,
  profilePicture: string | null,
  birthYear: string,
  setWaitingForVerification: (value: boolean) => void,
  isBusiness: boolean,
  navigation: any
) => {
  if (
    !email ||
    !password ||
    !name ||
    !surname ||
    !phone ||
    !idNumber ||
    !birthYear
  ) {
    Alert.alert("Error", "Please fill in all required fields.");
    return;
  }

  try {
    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${name} ${surname}`,
          first_name: name,
          last_name: surname,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    let profilePictureUrl = null;
    if (profilePicture) {
      try {
        // Get file info
        const fileInfo = await getFileInfo(profilePicture);
        if (fileInfo.size > 20 * 1024 * 1024) {
          throw new Error("Profile picture must be less than 20MB");
        }

        const fileExt = profilePicture.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

        // Read file content
        const fileContent = await readFile(profilePicture);

        // Upload with proper authentication
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, fileContent, {
            contentType: fileInfo.mimeType || `image/${fileExt}`,
            upsert: false,
            cacheControl: "3600",
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

        profilePictureUrl = publicUrl;
      } catch (error) {
        console.error("Image upload error:", error);
        Alert.alert(
          "Upload Error",
          error.message || "Failed to upload profile picture"
        );
      }
    }

    // Step 3: Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
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

    if (profileError) throw profileError;

    // Step 4: Show success
    setWaitingForVerification(true);
    navigation.replace("VerifyEmail", { email });
  } catch (error) {
    console.error("Signup error:", error);
    Alert.alert("Error", error.message || "Signup failed. Please try again.");

    // Clean up if possible
    if (supabase.auth.getSession()) {
      await supabase.auth.signOut();
    }
  }
};
export const handleLogout = async (setUser, navigation) => {
  try {
    await supabase.auth.signOut(); // Sign out the user
    setUser(null); // Clear the user data from the context
    navigation.replace("Login"); // Navigate to the login screen
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};
