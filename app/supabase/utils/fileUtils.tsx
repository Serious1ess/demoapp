// utils/fileUtils.ts
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { Buffer } from "buffer";

export const getFileInfo = async (uri: string) => {
  if (Platform.OS === "web") {
    // Web implementation
    const response = await fetch(uri);
    const blob = await response.blob();
    return {
      size: blob.size,
      uri: URL.createObjectURL(blob),
      mimeType: blob.type,
    };
  } else {
    // Mobile implementation
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }
    return {
      size: fileInfo.size,
      uri: fileInfo.uri,
      mimeType: (await FileSystem.getContentUriAsync(uri)).mimeType,
    };
  }
};

export const readFile = async (uri: string) => {
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
};
