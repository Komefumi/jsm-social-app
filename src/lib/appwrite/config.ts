import {
  Client,
  Account,
  Databases,
  Storage,
  Avatars,
  // Functions,
} from "appwrite";

export const appwriteConfig = {
  projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
};

export const client = new Client();

client.setProject(appwriteConfig.projectID).setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
// export const functions = new Functions(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
