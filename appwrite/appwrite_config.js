// appwriteConfig.js
import { Client, Account, Databases, Storage } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your Appwrite API endpoint
  .setProject("6825c9130002bf2b1514");              // Your Project ID

// Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
