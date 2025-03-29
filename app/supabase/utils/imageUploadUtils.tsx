// utils/imageUploadUtils.ts
import { supabase } from "../supabase";
import { getFileInfo, readFile } from "./fileUtils";

export const uploadProfileImage = async (
  userId: string,
  imageUri: string,
  bucketName: string = "avatars"
): Promise<string | null> => {
  try {
    // Validate inputs
    if (!userId || !imageUri) {
      throw new Error("Missing required parameters");
    }

    // Get file info
    const fileInfo = await getFileInfo(imageUri);
    if (fileInfo.size > 20 * 1024 * 1024) {
      throw new Error("Profile picture must be less than 20MB");
    }

    // Extract file extension (handle iOS paths that might not have extensions)
    let fileExt = "jpg";
    const lastDotIndex = imageUri.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const potentialExt = imageUri.substring(lastDotIndex + 1).toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(potentialExt)) {
        fileExt = potentialExt;
      }
    }

    // Generate filename with folder structure for better organization
    const fileName = `user_uploads/${userId}/${Date.now()}.${fileExt}`;
    const fileContent = await readFile(imageUri);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileContent, {
        contentType: fileInfo.mimeType || `image/${fileExt}`,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error; // Re-throw to let calling function handle it
  }
};
