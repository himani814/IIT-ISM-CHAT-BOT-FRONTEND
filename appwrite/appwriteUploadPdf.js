import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6825c9130002bf2b1514");

const account = new Account(client);
const databases = new Databases(client);

export { account, databases };

const DATABASE_ID = "6836c51200377ed9fbdd";
const COLLECTION_ID = "6836c51d00100789dcab";

// ✅ Store file metadata
export const storeFileMeta = async (name, max_id) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      "unique()",
      { NAME: name, MAX_SIZE: max_id }
    );
    return response;
  } catch (error) {
    console.error("Appwrite Error:", error);
    throw error;
  }
};

// ✅ Fetch all files
export const fetchAllFiles = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );
    return response.documents; // array of all documents
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

// ✅ Delete file metadata by document ID
export const deleteFileMeta = async (documentId) => {
  try {
    const response = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};
