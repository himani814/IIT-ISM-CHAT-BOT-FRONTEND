import { Client, Account, Permission, Role , Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6825c9130002bf2b1514");

const account = new Account(client);
const databases = new Databases(client);

export { account, databases };

const DATABASE_ID = "6836c51200377ed9fbdd";
const COLLECTION_ID = "684aabc7001935c2de11";






// Fetch all folders with pagination
export const fetchAllFolder = async (offset = 0, limit = 10) => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("is_folder", true),
      Query.offset(offset),
      Query.limit(limit)
    ]);
    return response.documents;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};





// Create a new folder and a public collection for it
export const createFolder = async (folder_name) => {
  try {
    const collectionId = ID.unique();

    // 1. Create new collection with public access
    const newCollection = await databases.createCollection(
      DATABASE_ID,
      collectionId,
      folder_name,
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );

    // 2. Add attributes to the new collection
    await databases.createStringAttribute(DATABASE_ID, collectionId, "folder_name", 255, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "is_folder", true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "sub_folder_id", 255, true);

    // 3. Wait for attributes to be ready (Appwrite needs time to index)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

    // 4. Create a document in the main folder collection with sub_folder_id = newCollectionId
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        folder_name,
        is_folder: true,
        sub_folder_id: collectionId,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );

    return response;
  } catch (error) {
    console.error("Create Folder Error:", error);
    throw error;
  }
};






// Delete a folder by document ID
export const deleteFolder = async (documentId) => {
  try {
    const response = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Delete Folder Error:", error);
    throw error;
  }
};
