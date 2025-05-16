// appwriteConfig.js
import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your Appwrite API endpoint
  .setProject("6825c9130002bf2b1514");              // Your Project ID

const account = new Account(client);

export { account };
