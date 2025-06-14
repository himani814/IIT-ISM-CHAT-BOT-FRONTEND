// src/appwrite/appwriteUploadRaw.js
import { databases } from "../appwrite_config.js";
import { ID, Query } from "appwrite";

const DATABASE_ID = "6836c51200377ed9fbdd";

export { DATABASE_ID };

// ✅ Fetch all files (with pagination)
export const fetchAllFiles = async (collection_id, offset = 0, limit = 10) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collection_id,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt")
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Appwrite Error (fetchAllFiles):", error);
    throw error;
  }
};